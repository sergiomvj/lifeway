import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, User, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Navbar from '@/components/Navbar';
import ToolsSection from '@/components/ToolsSection';
import Footer from '@/components/Footer';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  author_name: string | null;
  read_time: number | null;
  image_url: string | null;
  published_at: string | null;
  category_id: string | null;
  category?: {
    name: string;
  } | null;
  tags?: {
    name: string;
  }[];
}

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // Buscar posts publicados
      const { data: postsData, error: postsError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      // Buscar categorias e tags para cada post
      const postsWithDetails = await Promise.all(
        (postsData || []).map(async (post) => {
          // Buscar categoria
          let category = null;
          if (post.category_id) {
            const { data: categoryData } = await supabase
              .from('blog_categories')
              .select('name')
              .eq('id', post.category_id)
              .single();
            category = categoryData;
          }

          // Buscar tags
          const { data: tagsData } = await supabase
            .from('blog_post_tags')
            .select(`
              blog_tags(name)
            `)
            .eq('post_id', post.id);

          return {
            ...post,
            category,
            tags: tagsData?.map(item => item.blog_tags).filter(Boolean) || []
          };
        })
      );

      setPosts(postsWithDetails);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Função para determinar a cor do card com base na tag
  const getTagColor = (tagName?: string) => {
    if (!tagName) return 'bg-gradient-to-br from-lilas to-secondary';
    
    // Converter para minúsculas para comparação
    const tag = tagName.toLowerCase();
    
    // Mapear tags para cores específicas
    if (tag.includes('imigração') || tag.includes('imigracao')) {
      return 'bg-gradient-to-br from-blue-400 to-blue-600';
    } else if (tag.includes('trabalho') || tag.includes('emprego') || tag.includes('carreira')) {
      return 'bg-gradient-to-br from-green-400 to-green-600';
    } else if (tag.includes('estudo') || tag.includes('educação') || tag.includes('educacao')) {
      return 'bg-gradient-to-br from-amber-400 to-amber-600';
    } else if (tag.includes('visto') || tag.includes('visa')) {
      return 'bg-gradient-to-br from-red-400 to-red-600';
    } else if (tag.includes('moradia') || tag.includes('casa') || tag.includes('apartamento')) {
      return 'bg-gradient-to-br from-purple-400 to-purple-600';
    } else if (tag.includes('saúde') || tag.includes('saude') || tag.includes('health')) {
      return 'bg-gradient-to-br from-teal-400 to-teal-600';
    } else if (tag.includes('finanças') || tag.includes('financas') || tag.includes('dinheiro')) {
      return 'bg-gradient-to-br from-yellow-400 to-yellow-600';
    } else if (tag.includes('cultura') || tag.includes('adaptação') || tag.includes('adaptacao')) {
      return 'bg-gradient-to-br from-indigo-400 to-indigo-600';
    } else if (tag.includes('família') || tag.includes('familia')) {
      return 'bg-gradient-to-br from-pink-400 to-pink-600';
    } else if (tag.includes('negócio') || tag.includes('negocio') || tag.includes('empreendedorismo')) {
      return 'bg-gradient-to-br from-cyan-400 to-cyan-600';
    }
    
    // Cores padrão para outras tags (rotação de 5 cores)
    const tagHash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const colorIndex = tagHash % 5;
    
    const colorOptions = [
      'bg-gradient-to-br from-lilas to-secondary',
      'bg-gradient-to-br from-petroleo to-blue-500',
      'bg-gradient-to-br from-amber-500 to-orange-600',
      'bg-gradient-to-br from-emerald-500 to-teal-600',
      'bg-gradient-to-br from-purple-500 to-pink-500'
    ];
    
    return colorOptions[colorIndex];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cinza-claro to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-petroleo mx-auto mb-4"></div>
          <p className="text-petroleo font-figtree">Carregando artigos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-baskerville font-bold text-petroleo mb-4">
            Blog LifeWayUSA
          </h1>
          <p className="text-lg text-gray-600 font-figtree max-w-2xl mx-auto">
            Artigos, guias e dicas para sua jornada de imigração para os Estados Unidos
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {posts.map((post) => (
            <Card key={post.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <Link to={`/blog/${post.slug}`} className="block">
                <div className="relative">
                  {/* Cor baseada na primeira tag do artigo */}
                  <div className={`w-full h-24 rounded-t-lg ${getTagColor(post.tags?.[0]?.name)}`}></div>
                  
                  {post.category && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-petroleo">
                        {post.category.name}
                      </Badge>
                    </div>
                  )}
                </div>

                <CardHeader>
                  <CardTitle className="text-xl font-baskerville text-petroleo line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {post.summary && (
                    <p className="text-gray-600 font-figtree text-sm line-clamp-3">
                      {post.summary}
                    </p>
                  )}

                  {/* Meta info */}
                  <div className="flex flex-wrap gap-2 text-sm text-gray-500 font-figtree">
                    {post.author_name && (
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{post.author_name}</span>
                      </div>
                    )}
                    
                    {post.read_time && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.read_time} min</span>
                      </div>
                    )}

                    {post.published_at && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(post.published_at)}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag.name}
                        </Badge>
                      ))}
                      {post.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {posts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 font-figtree text-lg">
              Nenhum artigo publicado ainda. Volte em breve!
            </p>
          </div>
        )}
      </div>

      <ToolsSection />
      <Footer />
    </div>
  );
};

export default BlogPage;