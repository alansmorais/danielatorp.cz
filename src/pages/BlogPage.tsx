import React, { useEffect } from 'react';
import { BLOG_POSTS } from '../data/blogPosts';
import { BlogPost } from '../types';

interface BlogPageProps {
  onOpenModal: (
    tag: string,
    title: string,
    content: React.ReactNode,
    actionText?: string,
    onAction?: () => void
  ) => void;
  onNavigate: (route: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onOpenModal, onNavigate }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openPostModal = (post: BlogPost) => {
    onOpenModal(
      post.date,
      post.title,
      <div>
        <img
          src={post.image}
          alt={post.title}
          style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }}
        />
        <div style={{ whiteSpace: 'pre-line', lineHeight: 1.8, color: '#444' }}>
          {post.content}
        </div>
      </div>,
      'Kontaktovat Danielu',
      () => onNavigate('home')
    );
  };

  return (
    <div>
      {/* PAGE HERO */}
      <section className="page-hero">
        <div className="wrap page-hero-content">
          <h1>Blog</h1>
          <p>Úvahy, osobní příběhy a postřehy o intimitě, těle a vztazích.</p>
        </div>
      </section>

      {/* BLOG CONTAINER */}
      <div className="wrap">
        <div className="blog-container">
          {/* Blog Posts List */}
          <div className="blog-posts">
            {BLOG_POSTS.map((post) => (
              <article key={post.id} className="blog-card">
                <img src={post.image} alt={post.title} />
                <div className="blog-card-content">
                  <div className="blog-meta">📅 {post.date}</div>
                  <h3>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        openPostModal(post);
                      }}
                    >
                      {post.title}
                    </a>
                  </h3>
                  <p className="blog-excerpt">{post.excerpt}</p>
                  <button
                    type="button"
                    className="button"
                    style={{ fontSize: '11.5px', padding: '7px 18px' }}
                    onClick={() => openPostModal(post)}
                  >
                    Přečíst celý článek
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Sidebar */}
          <aside>
            <div
              style={{
                background: '#fafafa',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '24px'
              }}
            >
              <h4 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '14px', color: '#111' }}>
                Kategorie
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ padding: '6px 0', borderBottom: '1px solid #eee' }}>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
                    Daniela v médiích (2)
                  </span>
                </li>
              </ul>

              <h4 style={{ fontSize: '16px', fontWeight: 500, margin: '24px 0 12px', color: '#111' }}>
                O blogu
              </h4>
              <p style={{ fontSize: '13.5px', color: '#666', lineHeight: 1.6 }}>
                Články píše přímo Daniela Torp na základě své dlouholeté praxe tělové terapeutky
                a koučky intimity.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
