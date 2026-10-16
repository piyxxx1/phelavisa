

export const ContactPage = () => {
  return (
    <div className="section-padding bg-gray-light" style={{ minHeight: '80vh' }}>
      <div className="section-container" style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '2rem 3rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#0f172a' }}>Contact Support</h1>
        <div style={{ color: '#475569', lineHeight: '1.8' }}>
          <p style={{ marginBottom: '1rem' }}>We are here to help! If you have any questions about your visa application or need general guidance, please reach out to our support team.</p>
          
          <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#1e293b' }}>Get In Touch</h2>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '0.8rem' }}><strong>Email:</strong> <a href="mailto:contact@phelavisa.com" style={{ color: '#2563eb', textDecoration: 'none' }}>contact@phelavisa.com</a></li>
            <li style={{ marginBottom: '0.8rem' }}><strong>Hours:</strong> Monday - Saturday, 9:00 AM - 6:00 PM IST</li>
          </ul>

          <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#1e293b' }}>Office Locations</h2>
          <p style={{ marginBottom: '0.5rem' }}><strong>New Delhi (Registered Office):</strong></p>
          <p style={{ marginBottom: '1.5rem' }}>50, 51 Second Floor, Regal Building, Connaught Place, New Delhi – 110001</p>

          <p style={{ marginBottom: '0.5rem' }}><strong>Noida:</strong></p>
          <p style={{ marginBottom: '1.5rem' }}>Ist Floor, B-1A/06, Sector 51, Noida (U.P) - 201301</p>

          <p style={{ marginBottom: '0.5rem' }}><strong>Bengaluru:</strong></p>
          <p style={{ marginBottom: '1.5rem' }}>759, 3rd Floor, 8th Main Road, JP Nagar Phase 3, Bengaluru – 560078</p>
          
          <p style={{ marginBottom: '0.5rem' }}><strong>Kochi:</strong></p>
          <p style={{ marginBottom: '1.5rem' }}>2nd Floor, Rameesha Building, SRM Road, Kaloor, Ernakulam North – 682018</p>
        </div>
      </div>
    </div>
  );
};
