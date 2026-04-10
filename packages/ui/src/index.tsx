import React from 'react';

export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid #262626', borderRadius: 20, padding: 20, background: '#101010', color: '#fff' }}>
      <h3 style={{ marginTop: 0, marginBottom: 12 }}>{title}</h3>
      {children}
    </div>
  );
}

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      style={{
        padding: '10px 14px',
        borderRadius: 12,
        border: '1px solid #7c3aed',
        background: '#7c3aed',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: 700,
        ...(props.style || {})
      }}
    />
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: 20, marginBottom: 12 }}>{children}</h2>;
}
