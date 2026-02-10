import { useState, useEffect, useRef } from 'react';
import { Calendar, ArrowRight, Tag } from 'lucide-react';

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

const tags = [
  { label: 'Todas', value: 'all', color: 'bg-crfal-blue' },
  { label: 'Institucional', value: 'institucional', color: 'bg-purple-500' },
  { label: 'Notícias', value: 'noticias', color: 'bg-blue-500' },
  { label: 'Cursos', value: 'cursos', color: 'bg-green-500' },
  { label: 'Eventos', value: 'eventos', color: 'bg-orange-500' },
];

const publications: Publication[] = [
  {
    id: 1,
    title: 'CRFAL participa do Congresso Nacional de Farmácia 2024',
    excerpt:
      'Delegação alagoana marca presença no maior evento farmacêutico do país, com palestras e workshops sobre inovação.',
    image: '/images/pub1.jpg',
    date: '15 de Janeiro, 2024',
    tag: 'Institucional',
    tagColor: 'bg-purple-500',
    href: '#noticia-1',
  },
  {
    id: 2,
    title: 'Novo curso: Gestão de Farmácia Hospitalar',
    excerpt:
      'Inscrições abertas para a nova turma da especialização em gestão hospitalar com início previsto para fevereiro.',
    image: '/images/pub2.jpg',
    date: '12 de Janeiro, 2024',
    tag: 'Cursos',
    tagColor: 'bg-green-500',
    href: '#noticia-2',
  },
  {
    id: 3,
    title: 'Farmácia Popular: Novas diretrizes regulatórias',
    excerpt:
      'Conselho Federal atualiza normas para programas de farmácia popular, trazendo mais segurança aos pacientes.',
    image: '/images/pub3.jpg',
    date: '10 de Janeiro, 2024',
    tag: 'Notícias',
    tagColor: 'bg-blue-500',
    href: '#noticia-3',
  },
  {
    id: 4,
    title: 'Seminário Regional de Farmacovigilância',
    excerpt:
      'Evento gratuito discute segurança do medicamento na prática clínica com especialistas renomados.',
    image: '/images/pub4.jpg',
    date: '8 de Janeiro, 2024',
    tag: 'Eventos',
    tagColor: 'bg-orange-500',
    href: '#noticia-4',
  },
  {
    id: 5,
    title: 'Dia do Farmacêutico: Programação especial',
    excerpt:
      'Confira a agenda de atividades em comemoração à data, incluindo palestras, homenagens e confraternização.',
    image: '/images/pub5.jpg',
    date: '5 de Janeiro, 2024',
    tag: 'Institucional',
    tagColor: 'bg-purple-500',
    href: '#noticia-5',
  },
  {
    id: 6,
    title: 'Telefarmácia: Regulamentação e boas práticas',
    excerpt:
      'CRFAL lança guia orientativo para serviços de telefarmácia, auxiliando profissionais na adoção das novas tecnologias.',
    image: '/images/pub6.jpg',
    date: '3 de Janeiro, 2024',
    tag: 'Notícias',
    tagColor: 'bg-blue-500',
    href: '#noticia-6',
  },
];

export default function Publicacoes() {
  const [activeTag, setActiveTag] = useState('all');
  const [filteredPublications, setFilteredPublications] =
    useState(publications);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  useEffect(() => {
    if (activeTag === 'all') {
      setFilteredPublications(publications);
    } else {
      const tagLabel = tags.find((t) => t.value === activeTag)?.label;
      setFilteredPublications(
        publications.filter((pub) => pub.tag === tagLabel)
      );
    }
  }, [activeTag]);

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

                <h3 className="font-bold text-neutral-800 mb-2 line-clamp-2 group-hover:text-crfal-blue transition-colors duration-300">
                  {pub.title}
                </h3>

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

        {/* View All Button */}
        <div
          className={`mt-10 text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '800ms' }}
        >
          <a href="#todas-publicacoes" className="btn-outline inline-flex items-center gap-2">
            Ver todas as publicações
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
