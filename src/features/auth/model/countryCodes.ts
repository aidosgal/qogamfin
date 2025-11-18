export interface CountryCode {
  name: string;
  code: string;
  flag: string;
}

export const countryCodes: CountryCode[] = [
  { name: 'Казахстан', code: '+7', flag: '🇰🇿' },
  { name: 'Россия', code: '+7', flag: '🇷🇺' },
  { name: 'США', code: '+1', flag: '🇺🇸' },
  { name: 'Великобритания', code: '+44', flag: '🇬🇧' },
  { name: 'Германия', code: '+49', flag: '🇩🇪' },
  { name: 'Франция', code: '+33', flag: '🇫🇷' },
  { name: 'Турция', code: '+90', flag: '🇹🇷' },
  { name: 'Узбекистан', code: '+998', flag: '🇺🇿' },
  { name: 'Кыргызстан', code: '+996', flag: '🇰🇬' },
];
