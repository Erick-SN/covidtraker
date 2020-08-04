import numeral from 'numeral';
export const prettyStyle = (stat) =>
  stat ? `+${numeral(stat).format('0.0a')}` : '+0';
