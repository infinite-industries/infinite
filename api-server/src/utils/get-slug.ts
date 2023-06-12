export default function getSlug(title: string): string {
  if (!title) {
    return 'missing-title';
  }

  return title.toLowerCase().replace(/ /g, '-');
}
