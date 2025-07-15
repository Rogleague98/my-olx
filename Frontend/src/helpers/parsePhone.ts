export function parsePhone(phone: string): string {
  // Simple US phone formatting
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
} 