const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatDate(value: string | null | undefined) {
  if (!value) return 'Ainda não atualizado';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Data indisponível';
  return dateFormatter.format(date).replace('.', '');
}

export function firstName(name: string | undefined) {
  return name?.trim().split(/\s+/)[0] || 'investidor';
}

export function humanizeCode(value: string | null | undefined) {
  if (!value) return 'Não informado';
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
