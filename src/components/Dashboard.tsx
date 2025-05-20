import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  IconButton,
  Button,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  WaterDrop as WaterDropIcon,
  Thermostat as ThermostatIcon,
  Grass as GrassIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

interface RiskData {
  id: number;
  timestamp: string;
  riskLevel: number;
  rainfall: number;
  soilMoisture: number;
  temperature: number;
  location: string;
  status: string;
}

const locations = ['PONTO-A', 'PONTO-B'];

const faqItems = [
  {
    question: 'O que significa o nível de risco?',
    answer: 'O nível de risco é uma medida que varia de 0 a 100%, indicando a probabilidade de ocorrer um deslizamento. Quanto maior o número, maior o risco. Verde (0-30%) significa baixo risco, laranja (31-60%) significa risco moderado, e vermelho (61-100%) significa alto risco.'
  },
  {
    question: 'Como os dados são coletados?',
    answer: 'Utilizamos sensores instalados em pontos estratégicos que medem chuva, umidade do solo e temperatura. Estes dados são analisados em tempo real para calcular o risco de deslizamento.'
  },
  {
    question: 'O que fazer em caso de alto risco?',
    answer: 'Em caso de alto risco, é importante: 1) Evitar permanecer em áreas de risco, 2) Procurar abrigo em local seguro, 3) Seguir as orientações da Defesa Civil, 4) Manter-se informado sobre atualizações.'
  },
  {
    question: 'Com que frequência os dados são atualizados?',
    answer: 'Os dados são atualizados automaticamente a cada 30 segundos, garantindo informações em tempo real sobre as condições de risco.'
  }
];

const getRiskColor = (riskLevel: number) => {
  if (riskLevel < 0.3) return '#4caf50';
  if (riskLevel < 0.6) return '#ff9800';
  return '#f44336';
};

const getRiskDescription = (riskLevel: number) => {
  if (riskLevel < 0.3) return 'Baixo risco de deslizamento';
  if (riskLevel < 0.6) return 'Risco moderado de deslizamento';
  return 'Alto risco de deslizamento';
};

const getRiskIcon = (riskLevel: number) => {
  if (riskLevel < 0.3) return <CheckCircleIcon />;
  if (riskLevel < 0.6) return <WarningIcon />;
  return <ErrorIcon />;
};

const getRecommendations = (riskLevel: number) => {
  if (riskLevel < 0.3) {
    return [
      {
        text: 'Mantenha-se informado sobre as condições climáticas',
        detail: 'Acompanhe as previsões do tempo e os alertas oficiais.'
      },
      {
        text: 'Verifique regularmente o estado do terreno',
        detail: 'Observe se há mudanças na inclinação ou rachaduras no solo.'
      }
    ];
  }
  if (riskLevel < 0.6) {
    return [
      {
        text: 'Fique atento a mudanças no terreno',
        detail: 'Observe se há rachaduras, árvores inclinadas ou barulhos estranhos.'
      },
      {
        text: 'Evite áreas com inclinação acentuada',
        detail: 'Mantenha distância de encostas e áreas com declive.'
      },
      {
        text: 'Monitore o nível de chuva',
        detail: 'Chuvas intensas podem aumentar o risco de deslizamento.'
      }
    ];
  }
  return [
    {
      text: 'Evite permanecer em áreas de risco',
      detail: 'Procure um local seguro imediatamente.'
    },
    {
      text: 'Procure abrigo em local seguro',
      detail: 'Dirija-se para áreas planas e distantes de encostas.'
    },
    {
      text: 'Siga as orientações da Defesa Civil',
      detail: 'Acompanhe as instruções oficiais para sua região.'
    },
    {
      text: 'Mantenha-se informado sobre atualizações',
      detail: 'Fique atento aos canais oficiais de comunicação.'
    }
  ];
};

const generateMockRiskData = (location: string): RiskData[] => {
  const now = new Date();
  const mockData: RiskData[] = [];

  for (let i = 0; i < 10; i++) {
    const timestamp = new Date(now.getTime() - i * 30000).toISOString();
    const riskLevel = Math.random();
    
    mockData.push({
      id: i,
      timestamp,
      riskLevel,
      rainfall: Math.random() * 50,
      soilMoisture: Math.random(),
      temperature: 20 + Math.random() * 10,
      location,
      status: riskLevel < 0.3 ? 'Baixo' : riskLevel < 0.6 ? 'Moderado' : 'Alto'
    });
  }

  return mockData;
};

const Dashboard: React.FC = () => {

  interface ChartData {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      fill: boolean;
      borderColor: string;
      tension: number;
    }[];
  }

  const [selectedLocation, setSelectedLocation] = useState('PONTO-A');
  const [riskData, setRiskData] = useState<RiskData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: 'Risco de Deslizamento',
        data: [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  });

  const fetchData = () => {
    try {
      setLoading(true);
      setError(null);
      
      // Usa dados mock em vez de chamada HTTP
      const data = generateMockRiskData(selectedLocation);
      setRiskData(data);
      
      const labels = data.map((item: RiskData) => {
        const date = new Date(item.timestamp);
        return date.toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      });
      const riskLevels = data.map((item: RiskData) => item.riskLevel);
      
      setChartData({
        labels,
        datasets: [
          {
            label: 'Risco de Deslizamento',
            data: riskLevels,
            fill: false,
            borderColor: getRiskColor(riskLevels[0] || 0),
            tension: 0.1,
          },
        ],
      });
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setError('Erro ao carregar dados. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const forceUpdate = () => {
    try {
      setUpdating(true);
      setUpdateSuccess(null);
      setError(null);

      // Força geração de novos dados mock
      const data = generateMockRiskData(selectedLocation);
      setRiskData(data);
      
      const labels = data.map((item: RiskData) => {
        const date = new Date(item.timestamp);
        return date.toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      });
      const riskLevels = data.map((item: RiskData) => item.riskLevel);
      
      setChartData({
        labels,
        datasets: [
          {
            label: 'Risco de Deslizamento',
            data: riskLevels,
            fill: false,
            borderColor: getRiskColor(riskLevels[0] || 0),
            tension: 0.1,
          },
        ],
      });
      
      setUpdateSuccess('Novos dados gerados com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      setError('Erro ao gerar novos dados. Por favor, tente novamente.');
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [selectedLocation]);

  const currentRisk = riskData[0]?.riskLevel || 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Monitoramento de Deslizamentos
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Sistema de monitoramento em tempo real para prevenção de deslizamentos
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {updating && (
                <CircularProgress size={24} sx={{ mr: 1 }} />
              )}
              <Button
                variant="contained"
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={forceUpdate}
                disabled={updating}
                sx={{ minWidth: 200 }}
              >
                {updating ? 'Atualizando...' : 'Atualizar Dados'}
              </Button>
            </Box>
          </Box>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert 
              severity="error" 
              onClose={() => setError(null)}
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          </Grid>
        )}

        {updateSuccess && (
          <Grid item xs={12}>
            <Alert 
              severity="success" 
              onClose={() => setUpdateSuccess(null)}
              sx={{ mb: 2 }}
            >
              {updateSuccess}
            </Alert>
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Localidade</InputLabel>
            <Select
              value={selectedLocation}
              label="Localidade"
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              {locations.map((location) => (
                <MenuItem key={location} value={location}>
                  {location}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Status Atual
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : (
              <Box>
                <Chip
                  icon={getRiskIcon(currentRisk)}
                  label={getRiskDescription(currentRisk)}
                  sx={{
                    backgroundColor: getRiskColor(currentRisk),
                    color: 'white',
                    fontSize: '1.1rem',
                    padding: '20px',
                    marginBottom: 2,
                  }}
                />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Última atualização: {new Date(riskData[0]?.timestamp).toLocaleString()}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Condições Atuais
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <WaterDropIcon sx={{ mr: 1 }} />
                    <Typography color="textSecondary">Chuva</Typography>
                    <Tooltip title="Volume de chuva acumulado nas últimas 24 horas">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography variant="h6">{riskData[0]?.rainfall.toFixed(1)} mm</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <GrassIcon sx={{ mr: 1 }} />
                    <Typography color="textSecondary">Umidade do Solo</Typography>
                    <Tooltip title="Porcentagem de água presente no solo">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography variant="h6">{(riskData[0]?.soilMoisture * 100).toFixed(1)}%</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ThermostatIcon sx={{ mr: 1 }} />
                    <Typography color="textSecondary">Temperatura</Typography>
                    <Tooltip title="Temperatura atual do ambiente">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography variant="h6">{riskData[0]?.temperature.toFixed(1)}°C</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <WarningIcon sx={{ mr: 1 }} />
                    <Typography color="textSecondary">Nível de Risco</Typography>
                    <Tooltip title="Probabilidade de ocorrer um deslizamento">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography variant="h6">{(currentRisk * 100).toFixed(1)}%</Typography>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Histórico de Risco
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : (
              <Box sx={{ height: 300 }}>
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 1,
                        title: {
                          display: true,
                          text: 'Nível de Risco',
                        },
                      },
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `Risco: ${(context.parsed.y * 100).toFixed(1)}%`;
                          }
                        }
                      }
                    }
                  }}
                />
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recomendações
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : (
              <Box>
                <Alert severity={currentRisk < 0.3 ? "success" : currentRisk < 0.6 ? "warning" : "error"} sx={{ mb: 2 }}>
                  {getRiskDescription(currentRisk)}
                </Alert>
                <Grid container spacing={2}>
                  {getRecommendations(currentRisk).map((recommendation, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {recommendation.text}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {recommendation.detail}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Perguntas Frequentes
            </Typography>
            {faqItems.map((item, index) => (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>{item.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{item.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 