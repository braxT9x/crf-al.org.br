import { useState, useEffect, useRef } from 'react';
import { Calendar, ArrowRight, Tag } from 'lucide-react';

// 1. Interface para os dados BRUTOS que vêm do WordPress
interface WPPost {
  id: number;
  date: string;
  link: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
    }>>;
  };
}

// 2. Interface para os dados JÁ TRATADOS que seu componente usa
interface Publication {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  tag: string;
  tagColor: string;
  href: string;
}

// 🔴 Configure aqui a URL do seu WordPress
const WP_API_URL = "https://wordpress.crf-al.org.br/wp-json/wp/v2/posts?_embed&per_page=6";

// Helper para formatar a data
const formatarData = (dataISO: string) => {
  return new Date(dataISO).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Helper para definir cor baseada no nome da categoria (Opcional)
const getTagColor = (tagName: string) => {
  const map: Record<string, string> = {
    'Notícias': 'bg-blue-500',
    'Institucional': 'bg-purple-500',
    'Cursos': 'bg-green-500',
    'Eventos': 'bg-orange-500',
  };
  return map[tagName] || 'bg-crfal-blue'; // Cor padrão
};

// As tags do filtro (Isso aqui idealmente viria do WP também, mas mantive estático para facilitar)
const tags = [
  { label: 'Todas', value: 'all', color: 'bg-crfal-blue' },
  { label: 'Institucional', value: 'Institucional', color: 'bg-purple-500' },
  { label: 'Notícias', value: 'Notícias', color: 'bg-blue-500' },
  { label: 'Cursos', value: 'Cursos', color: 'bg-green-500' },
  { label: 'Eventos', value: 'Eventos', color: 'bg-orange-500' },
];

export default function Publicacoes() {
  const [activeTag, setActiveTag] = useState('all');
  
  // 3. Mudança: O estado inicial agora é vazio []
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true); // Estado de carregamento
  
  const [filteredPublications, setFilteredPublications] = useState<Publication[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // 4. Efeito para buscar as notícias no WordPress
  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch(WP_API_URL);
        const data: WPPost[] = await response.json();

        // Aqui transformamos o JSON feio do WP no formato bonito do seu site
        const mappedNews: Publication[] = data.map((post) => {
          // Tenta pegar a categoria, se não tiver, usa "Geral"
          const categoryName = post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Geral';
          
          return {
            id: post.id,
            title: post.title.rendered,
            // Remove tags HTML do resumo (<p>, etc)
            excerpt: post.excerpt.rendered.replace(/<[^>]*>?/gm, '').slice(0, 100) + '...',
            // Pega a imagem destaque ou usa uma padrão
            image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/placeholder.jpg',
            date: formatarData(post.date),
            tag: categoryName,
            tagColor: getTagColor(categoryName),
            href: post.link, // Link para o post original ou página interna
          };
        });

        setPublications(mappedNews);
        setFilteredPublications(mappedNews);
      } catch (error) {
        console.error("Erro ao buscar notícias:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  // Efeito de Animação (Scroll)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Efeito de Filtro
  useEffect(() => {
    if (activeTag === 'all') {
      setFilteredPublications(publications);
    } else {
      // Filtra comparando o nome da tag (Categoria)
      setFilteredPublications(
        publications.filter((pub) => pub.tag === activeTag) // Atenção: O nome da categoria no WP tem que ser igual ao 'value' do botão
      );
    }
  }, [activeTag, publications]);

  return (
    <section ref={sectionRef} id="publicacoes" className="py-20 md:py-28 bg-white">
      <div className="container-crfal">
        <div
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div>
            <span className="inline-block px-4 py-1.5 bg-crfal-blue-lighter text-crfal-blue text-sm font-semibold rounded-full mb-4">
              Publicações
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800">
              Nossas Publicações
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.value}
                onClick={() => setActiveTag(tag.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTag === tag.value
                    ? `${tag.color} text-white`
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20 text-neutral-500">
            <div className="animate-spin w-8 h-8 border-4 border-crfal-blue border-t-transparent rounded-full mx-auto mb-4"></div>
            Carregando notícias...
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPublications.map((pub, index) => (
              <article
                key={pub.id}
                className={`group bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-200 hover:border-crfal-blue/30 hover:shadow-lg transition-all duration-300 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: isVisible ? `${200 + index * 80}ms` : '0ms',
                }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={pub.image}
                    alt={pub.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                        // Fallback se a imagem quebrar
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Sem+Imagem';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Tag */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 ${pub.tagColor} text-white text-xs font-semibold rounded-full`}
                    >
                      <Tag className="w-3 h-3" />
                      {pub.tag}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-neutral-500 text-sm mb-3">
                    <Calendar className="w-4 h-4" />
                    {pub.date}
                  </div>

                  <h3 
                    className="font-bold text-neutral-800 mb-2 line-clamp-2 group-hover:text-crfal-blue transition-colors duration-300"
                    dangerouslySetInnerHTML={{ __html: pub.title }} 
                  />

                  <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                    {pub.excerpt}
                  </p>

                  {/* Read More */}
                  <a
                    href={pub.href}
                    className="inline-flex items-center gap-2 text-crfal-blue font-medium text-sm group/link"
                  >
                    <span className="group-hover/link:underline">
                      Ler mais
                    </span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div
          className={`mt-10 text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '800ms' }}
        >
          <a href="/todas-noticias" className="btn-outline inline-flex items-center gap-2">
            Ver todas as publicações
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}