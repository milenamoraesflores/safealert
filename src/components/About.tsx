import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar
} from '@mui/material';

const teamMembers = [
  {
    name: 'Milena Flores',
    role: 'Cientista de Dados',
    description:
      'Especialista em Machine Learning com foco em análise de riscos ambientais. Desenvolve modelos preditivos avançados para prevenção de deslizamentos.',
    photo: "/images/milena.jpg",
    skills: ['Machine Learning', 'Análise de Dados', 'Python']
  },
  {
    name: 'Roan Ferreira',
    role: 'Desenvolvedora Backend',
    description:
      'Arquiteta de sistemas robustos com ampla experiência em desenvolvimento de APIs e infraestrutura de dados em tempo real.',
    photo: "/images/roan.jpg",
    skills: ['Python', 'APIs REST', 'Arquitetura de Sistemas']
  },
  {
    name: 'Rodrigo Thenopholo',
    role: 'Desenvolvedor Frontend',
    description:
      'Designer de interfaces e desenvolvedor frontend especializado em criar experiências de usuário intuitivas e responsivas.',
    photo: "/images/rodrigo.jpg",
    skills: ['React', 'TypeScript', 'Design de Interface']
  }
];

const technologies = [
  {
    name: 'React',
    img: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg'
  },
  {
    name: 'Python',
    img: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg'
  }
];

const About: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Nome do Projeto */}
      <Box
        sx={{
          mb: 4,
          backgroundColor: '#0d47a1',
          color: 'white',
          borderRadius: 4,
          boxShadow: 4,
          p: 3,
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" fontWeight={800} letterSpacing={1}>
          TECH BUSINESS SOLUTIONS
        </Typography>
      </Box>

      {/* Pitch */}
      <Box
        sx={{
          mb: 6,
          backgroundColor: '#ffffff',
          borderRadius: 4,
          boxShadow: 3,
          p: 4,
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
          Pitch do Projeto
        </Typography>
        <Box
          sx={{
            mt: 3,
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: 4,
            maxWidth: 800,
            mx: 'auto'
          }}
        >
          <iframe
            width="100%"
            height="450"
            src="https://www.youtube.com/embed/0fSZzLJX9wI"
            title="Pitch do Sistema de Previsão de Deslizamentos"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ border: 'none' }}
          ></iframe>
        </Box>
      </Box>

      {/* Projeto */}
      <Box sx={{ mb: 6, backgroundColor: '#ffffff', borderRadius: 4, boxShadow: 3, p: 4 }}>
        <Typography variant="h5" fontWeight={700} color="primary" gutterBottom>
          Nosso Projeto
        </Typography>
        <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.8, textAlign: 'justify' }}>
          O Sistema de Previsão de Deslizamentos representa uma solução tecnológica inovadora que
          combina machine learning avançado e análise de dados em tempo real para monitorar e prever
          riscos de deslizamentos em áreas vulneráveis. Nosso objetivo é fornecer alertas precisos
          e antecipados, contribuindo para a segurança de comunidades em regiões de risco geológico.
        </Typography>
      </Box>

      {/* Equipe */}
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="h5"
          fontWeight={700}
          color="primary"
          gutterBottom
          textAlign="center"
        >
          Conheça Nossa Equipe
        </Typography>
        <Grid container spacing={4}>
          {teamMembers.map((member, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: 4
                  }}
                >
                  <Avatar
                    alt={member.name}
                    src={member.photo}
                    sx={{ width: 80, height: 80, mb: 2 }}
                  />
                  <Typography variant="h6" fontWeight={700}>
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {member.description}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
                    {member.skills.map((skill, skillIndex) => (
                      <Chip
                        key={skillIndex}
                        label={skill}
                        size="small"
                        sx={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Tecnologias */}
      <Box sx={{ backgroundColor: '#ffffff', borderRadius: 4, boxShadow: 3, p: 4 }}>
        <Typography
          variant="h5"
          fontWeight={700}
          color="primary"
          gutterBottom
          textAlign="center"
        >
          Tecnologias Utilizadas
        </Typography>
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
          {technologies.map((tech, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 2,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 5
                  }
                }}
              >
                <Avatar
                  sx={{ mb: 2, width: 64, height: 64 }}
                  src={tech.img}
                  alt={`${tech.name} logo`}
                  variant="circular"
                />
                <Typography variant="h6" fontWeight={600}>
                  {tech.name}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default About;
