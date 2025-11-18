import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const FeatureCard = ({ number, title, description }: { number: string; title: string; description: string }) => (
  <View style={styles.featureCard}>
    <View style={styles.numberBadge}>
      <Text style={styles.numberText}>{number}</Text>
    </View>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDescription}>{description}</Text>
  </View>
);

const ConsultationCard = ({ 
  iconName, 
  title, 
  subtitle, 
  onPress 
}: { 
  iconName: string; 
  title: string; 
  subtitle: string;
  onPress: () => void;
}) => (
  <Pressable style={styles.consultationCard} onPress={onPress}>
    <View style={styles.iconContainer}>
      <MaterialIcons name={iconName as any} size={24} color="#FFFFFF" />
    </View>
    <View style={styles.consultationContent}>
      <Text style={styles.consultationTitle}>{title}</Text>
      <Text style={styles.consultationSubtitle}>{subtitle}</Text>
    </View>
  </Pressable>
);

export default function ConsultScreen() {
  const handleLegalConsultation = () => {
    // Open WhatsApp with legal consultation
    Linking.openURL('https://wa.me/77000230144');
  };

  const handleFinancialConsultation = () => {
    // Open WhatsApp with financial consultation
    Linking.openURL('https://wa.me/77000230144');
  };

  const features = [
    {
      number: '1',
      title: 'Индивидуальный подход',
      description: 'Мы разрабатываем персональный план выхода из кризиса, учитывая вашу ситуацию',
    },
    {
      number: '2',
      title: 'Бесплатная консультация',
      description: 'Все консультации бесплатны. Оцените нашу компетентность перед сотрудничеством.',
    },
    {
      number: '3',
      title: 'Профессиональная помощь',
      description: 'Наши эксперты помогут разобраться с долгами и найти оптимальные решения.',
    },
    {
      number: '4',
      title: 'Поддержка 24/7',
      description: 'Помогаем даже в нерабочее время. Нажмите SOS и свяжитесь с нами.',
    },
    {
      number: '5',
      title: 'Конфиденциальность',
      description: 'Ваши обращения строго конфиденциальны. Мы создаём безопасное пространство для общения.',
    },
  ];

  return (
    <ScrollView style={styles.container} >
      
        
        
        <Text style={styles.mainTitle}>Чат для консультации</Text>

        
        <ConsultationCard
          iconName="info"
          title="Юридическая Консультация"
          subtitle="Нажмите чтобы написать на Whatsapp"
          onPress={handleLegalConsultation}
        />
        
        <ConsultationCard
          iconName="attach-money"
          title="Финансовая Консультация"
          subtitle="Нажмите чтобы написать на Whatsapp"
          onPress={handleFinancialConsultation}
        />

        
        <Text style={styles.sectionTitle}>Обращайтесь прямо сейчас</Text>

        
        <View style={styles.featuresContainer}>
          {features.slice(0, 2).map((feature) => (
            <FeatureCard key={feature.number} {...feature} />
          ))}
        </View>
        
        <View style={styles.featuresContainer}>
          {features.slice(2, 4).map((feature) => (
            <FeatureCard key={feature.number} {...feature} />
          ))}
        </View>

       
        <View style={styles.fullWidthCard}>
          <FeatureCard {...features[4]} />
        </View>
        
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 65,
    paddingHorizontal:20,
    
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 100,
  },
  mainTitle: {
    fontSize: 24,
    fontFamily: 'Rubik_700Bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 15,
    marginTop: 20,
  },
  consultationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#93C5FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  consultationContent: {
    flex: 1,
  },
  consultationTitle: {
    fontSize: 15,
    fontFamily: 'Rubik_600Bold',
    color: '#000000',
    marginBottom: 3,
  },
  consultationSubtitle: {
    fontSize: 10,
    fontFamily: 'Rubik_100Regular',
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Rubik_600Bold',
    color: '#000000',
    marginTop: 1,
    marginBottom: 8,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 12,
  },
  fullWidthCard: {
    width: '100%',
    height: '15%',
    marginBottom: 5,
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  numberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 7,
  },
  numberText: {
    fontSize: 14,
    fontFamily: 'Rubik_700Bold',
    color: '#FFFFFF',
  },
  featureTitle: {
    fontSize: 14,
    fontFamily: 'Rubik_600Bold',
    color: '#000000',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 9,
    fontFamily: 'Rubik_400Regular',
    color: '#6B7280',
    lineHeight: 10,
  },
});

