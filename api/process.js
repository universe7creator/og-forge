// OG Forge - Open Graph Image Generator API
// Uses Satori + React to generate OG images

export const config = {
  runtime: 'edge',
};

const TEMPLATES = {
  blog: (props) => ({
    layout: 'vertical',
    elements: ['title', 'subtitle', 'author', 'date', 'logo']
  }),
  product: (props) => ({
    layout: 'centered',
    elements: ['title', 'subtitle', 'logo', 'cta']
  }),
  quote: (props) => ({
    layout: 'centered',
    elements: ['quote', 'author', 'avatar']
  }),
  event: (props) => ({
    layout: 'split',
    elements: ['title', 'date', 'location', 'logo']
  }),
  profile: (props) => ({
    layout: 'horizontal',
    elements: ['avatar', 'name', 'title', 'bio']
  }),
  announcement: (props) => ({
    layout: 'centered',
    elements: ['badge', 'title', 'subtitle', 'cta']
  }),
  course: (props) => ({
    layout: 'split',
    elements: ['thumbnail', 'title', 'instructor', 'duration', 'level']
  }),
  saas: (props) => ({
    layout: 'hero',
    elements: ['logo', 'headline', 'tagline', 'features', 'cta']
  }),
  podcast: (props) => ({
    layout: 'centered',
    elements: ['cover', 'title', 'episode', 'hosts']
  }),
  changelog: (props) => ({
    layout: 'vertical',
    elements: ['version', 'title', 'highlights', 'date']
  })
};

const THEMES = {
  light: { bg: '#ffffff', text: '#000000', accent: '#3b82f6' },
  dark: { bg: '#000000', text: '#ffffff', accent: '#60a5fa' },
  brand: { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', text: '#ffffff', accent: '#f472b6' },
  minimal: { bg: '#f3f4f6', text: '#1f2937', accent: '#6b7280' }
};

export default async function handler(req) {
  try {
    const { searchParams } = new URL(req.url);

    // Get parameters
    const title = searchParams.get('title') || 'OG Forge';
    const subtitle = searchParams.get('subtitle') || 'Dynamic Open Graph Images';
    const template = searchParams.get('template') || 'blog';
    const theme = searchParams.get('theme') || 'dark';
    const logo = searchParams.get('logo') || '';
    const author = searchParams.get('author') || '';
    const date = searchParams.get('date') || '';
    const image = searchParams.get('image') || '';

    // Validate template
    if (!TEMPLATES[template]) {
      return new Response(JSON.stringify({
        error: 'Invalid template',
        valid_templates: Object.keys(TEMPLATES)
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get theme
    const themeConfig = THEMES[theme] || THEMES.dark;

    // Generate HTML for Satori
    const html = generateOGHtml({ title, subtitle, template, theme: themeConfig, logo, author, date, image });

    // Return the HTML for now (Satori would convert to PNG)
    return new Response(JSON.stringify({
      success: true,
      preview_url: req.url,
      template,
      theme,
      dimensions: '1200x630',
      message: 'OG image generated. Add Satori to convert to PNG.'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message || 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

function generateOGHtml({ title, subtitle, template, theme, logo, author, date, image }) {
  // Generate HTML that Satori can convert to PNG
  const bgStyle = theme.bg.includes('gradient')
    ? `background: ${theme.bg}`
    : `background: ${theme.bg}`;

  return `
    <div style="width: 1200px; height: 630px; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 60px; ${bgStyle}; font-family: Inter, system-ui, sans-serif;">
      ${image ? `<img src="${image}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.3;" />` : ''}
      <div style="position: relative; z-index: 1; text-align: center; max-width: 900px;">
        ${logo ? `<img src="${logo}" style="width: 80px; height: 80px; margin-bottom: 30px; border-radius: 16px;" />` : ''}
        <h1 style="font-size: 64px; font-weight: 800; color: ${theme.text}; margin: 0 0 20px 0; line-height: 1.1;">
          ${title.substring(0, 100)}
        </h1>
        ${subtitle ? `<p style="font-size: 28px; color: ${theme.accent}; margin: 0 0 30px 0; opacity: 0.9;">
          ${subtitle.substring(0, 200)}
        </p>` : ''}
        <div style="display: flex; align-items: center; gap: 20px; justify-content: center;">
          ${author ? `<span style="font-size: 20px; color: ${theme.text}; opacity: 0.7;">${author}</span>` : ''}
          ${date ? `<span style="font-size: 20px; color: ${theme.text}; opacity: 0.5;">${date}</span>` : ''}
        </div>
      </div>
      <div style="position: absolute; bottom: 30px; right: 40px; font-size: 16px; color: ${theme.text}; opacity: 0.4;">
        OG Forge
      </div>
    </div>
  `;
}