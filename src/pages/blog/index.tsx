import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, User, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
                  <div className="w-full h-24 bg-gradient-to-br from-lilas to-secondary rounded-t-lg flex items-center justify-center">
                    <div className="text-petroleo text-4xl font-baskerville font-bold">
                      {post.title.charAt(0)}
                    </div>
                  </div>
                  
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