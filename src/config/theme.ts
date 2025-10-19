export const colors = {
  primaryBlue: '#4A90E2',
  deepBlue: '#2E5BFF',
  purpleAccent: '#8B5CF6',
  lightPurple: '#B794F4',
  backgroundDark: '#0F0F1E',
  cardDark: '#1A1A2E',
  white: '#FFFFFF',
  lightGray: '#E5E7EB',
  textGray: '#9CA3AF',
  successGreen: '#10B981',
  warningYellow: '#F59E0B',
  errorRed: '#EF4444',
};

export const gradients = {
  primary: 'linear-gradient(135deg, #4A90E2 0%, #8B5CF6 100%)',
  background: 'linear-gradient(180deg, #0F0F1E 0%, #16213E 100%)',
  card: 'linear-gradient(135deg, #1F1F3A 0%, #2A2A4A 100%)',
  score: 'linear-gradient(135deg, #2E5BFF 0%, #8B5CF6 50%, #B794F4 100%)',
};

export const getScoreColor = (score: number): string => {
  if (score >= 85) return colors.successGreen;
  if (score >= 70) return colors.primaryBlue;
  if (score >= 55) return colors.warningYellow;
  return colors.errorRed;
};

export const getScoreGradient = (score: number): string => {
  if (score >= 85) {
    return 'linear-gradient(135deg, #10B981 0%, #34D399 100%)';
  } else if (score >= 70) {
    return gradients.primary;
  } else if (score >= 55) {
    return 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)';
  } else {
    return 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)';
  }
};
