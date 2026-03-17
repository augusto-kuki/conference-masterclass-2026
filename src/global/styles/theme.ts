/**
 * Design tokens da aplicação.
 *
 * Cores padronizadas por função:
 * - primary / secondary: marca e variante (CTAs, fundos, botões)
 * - surface / surfaceMuted / surfaceSubdued: fundos e superfícies (branco → cinza claro)
 * - text / textMuted: tipografia (título e corpo)
 * - onPrimary: conteúdo sobre fundo primary (ícones, texto em botões primários)
 * - success / error / warning: semânticas (feedback, estados)
 */
export default {
  colors: {
    // Marca
    primary: '#003582',
    secondary: '#343B7F',
    primaryMuted: 'rgba(0, 53, 130, 0.15)',
    primaryMutedLight: 'rgba(0, 53, 130, 0.05)',
    primaryBorder: 'rgba(0, 53, 130, 0.3)',

    // Superfícies (fundos)
    surface: '#FFFFFF',
    surfaceMuted: '#f0f2f5',
    surfaceSubdued: '#E5E5E5',

    // Tipografia
    text: '#2e2d66',
    textMuted: '#969cb2',

    // Conteúdo sobre primary (headers, botão primário)
    onPrimary: '#FFFFFF',

    // Semânticas
    success: '#12A454',
    successMuted: 'rgba(18, 164, 84, 0.5)',
    error: '#e83f5b',
    errorMuted: 'rgba(232, 63, 91, 0.5)',
    warning: '#FFD700',
  },
  fonts: {
    regular: 'Montserrat_400Regular',
    medium: 'Montserrat_500Medium',
    bold: 'Montserrat_700Bold',
  },
}
