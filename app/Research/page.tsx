'use client';

import { useState } from 'react';


const INSIGHTS = [
  {
    id: 1,
    title: 'Market Analysis Q4 2024',
    description: 'Comprehensive market trends and predictions for the upcoming quarter.',
    pdfUrl: '/pdfs/market-analysis-q4.pdf',
    thumbnail: '/images/insight-1.jpg',
  },
  {
    id: 2,
    title: 'Consumer Behavior Study',
    description: 'Deep dive into changing consumer patterns in digital spaces.',
    pdfUrl: '/pdfs/consumer-behavior.pdf',
    thumbnail: '/images/insight-2.jpg',
  },
  {
    id: 3,
    title: 'Technology Adoption Report',
    description: 'Analysis of emerging technology adoption across industries.',
    pdfUrl: '/pdfs/tech-adoption.pdf',
    thumbnail: '/images/insight-3.jpg',
  },
];

export default function ResearchPage() {
  const [selectedInsight, setSelectedInsight] = useState<typeof INSIGHTS[0] | null>(null);

  return (
    <>
      <main style={styles.container}>
        <section style={styles.hero}>
          <h1 style={styles.heroTitle}>Research & Analysis</h1>
          <p style={styles.heroSubtitle}>
            In-depth insights and strategic analysis to inform your decisions
          </p>
        </section>

        <section style={styles.insights}>
          <h2 style={styles.sectionTitle}>Latest Insights</h2>
          <div style={styles.insightsGrid}>
            {INSIGHTS.map((insight) => (
              <article key={insight.id} style={styles.insightCard}>
                <div style={styles.thumbnail}>
                  <img src={insight.thumbnail} alt="" style={styles.thumbnailImg} />
                </div>
                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>{insight.title}</h3>
                  <p style={styles.cardDescription}>{insight.description}</p>
                  <button
                    style={styles.downloadBtn}
                    onClick={() => setSelectedInsight(insight)}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#6b54a5'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#755eb1'}
                  >
                    Download Report
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

    </>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #755eb1 0%, #6b54a5 100%)',
  },
  hero: {
    padding: '6rem 2rem 4rem',
    textAlign: 'center' as const,
    color: 'white',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: 700,
    marginBottom: '1rem',
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    opacity: 0.9,
    maxWidth: '600px',
    margin: '0 auto',
  },
  insights: {
    padding: '4rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: 600,
    color: 'white',
    marginBottom: '3rem',
    textAlign: 'center' as const,
  },
  insightsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  insightCard: {
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    transition: 'transform 0.2s',
  },
  thumbnail: {
    width: '100%',
    height: '200px',
    background: '#c1b4df',
    overflow: 'hidden',
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  cardContent: {
    padding: '1.5rem',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#755eb1',
    marginBottom: '0.5rem',
  },
  cardDescription: {
    color: '#666',
    lineHeight: 1.6,
    marginBottom: '1.5rem',
  },
  downloadBtn: {
    width: '100%',
    padding: '0.75rem',
    background: '#755eb1',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
};