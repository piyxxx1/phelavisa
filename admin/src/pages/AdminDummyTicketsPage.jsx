import { useState, useEffect, useMemo } from 'react';
import { API_BASE_URL } from '../config/apiConfig';
import {
  HiTicket,
  HiMagnifyingGlass,
  HiEye,
  HiCheckCircle,
  HiClock,
  HiPencilSquare,
  HiCurrencyRupee,
  HiSparkles,
  HiXMark,
  HiArrowPath,
  HiBuildingOffice2,
} from 'react-icons/hi2';
import { FaPlane, FaHotel } from 'react-icons/fa';

export const AdminDummyTicketsPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('ALL');

  // Global Pricing Settings State
  const [pricing, setPricing] = useState({
    flightPrice: 499,
    hotelPrice: 399,
    comboPrice: 799,
  });
  const [savingPricing, setSavingPricing] = useState(false);
  const [pricingMsg, setPricingMsg] = useState('');

  // Modal State
  const [selectedOrderModal, setSelectedOrderModal] = useState(null);
  const [editPnrCode, setEditPnrCode] = useState('');
  const [editOrderStatus, setEditOrderStatus] = useState('CONFIRMED');
  const [editAdminNotes, setEditAdminNotes] = useState('');

  // Fetch live orders and pricing from backend
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Orders
      const resOrders = await fetch(`${API_BASE_URL}/dummy-tickets`);
      if (resOrders.ok) {
        const dataOrders = await resOrders.json();
        setOrders(dataOrders);
      }

      // 2. Fetch Pricing Settings
      const resPricing = await fetch(`${API_BASE_URL}/dummy-tickets/settings`);
      if (resPricing.ok) {
        const dataPricing = await resPricing.json();
        setPricing({
          flightPrice: dataPricing.flightPrice || 499,
          hotelPrice: dataPricing.hotelPrice || 399,
          comboPrice: dataPricing.comboPrice || 799,
        });
      }
    } catch (err) {
      console.warn('API Error fetching dummy ticket data:', err);
      setError('Could not connect to server. Using local mode.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSavePricing = async (e) => {
    e.preventDefault();
    setSavingPricing(true);
    setPricingMsg('');
    try {
      const res = await fetch(`${API_BASE_URL}/dummy-tickets/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pricing),
      });
      if (res.ok) {
        setPricingMsg('✅ Global Dummy Ticket Prices Updated Successfully!');
        setTimeout(() => setPricingMsg(''), 3000);
      }
    } catch (err) {
      console.error('Failed to save pricing:', err);
      setPricingMsg('❌ Error saving prices.');
    } finally {
      setSavingPricing(false);
    }
  };

  const handleOpenModal = (order) => {
    setSelectedOrderModal(order);
    setEditPnrCode(order.pnrCode || '');
    setEditOrderStatus(order.orderStatus || 'CONFIRMED');
    setEditAdminNotes(order.adminNotes || '');
  };

  const handleSaveOrderUpdate = async () => {
    if (!selectedOrderModal) return;
    const payload = {
      pnrCode: editPnrCode,
      orderStatus: editOrderStatus,
      adminNotes: editAdminNotes,
    };

    setOrders((prev) =>
      prev.map((o) => (o.id === selectedOrderModal.id ? { ...o, ...payload } : o))
    );

    try {
      await fetch(`${API_BASE_URL}/dummy-tickets/${selectedOrderModal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('Failed to update order on server:', err);
    }

    setSelectedOrderModal(null);
    alert(`🎉 Order ${selectedOrderModal.id} updated successfully!`);
  };

  // Metrics Calculation
  const totalOrders = orders.length;
  const flightOrders = orders.filter((o) => o.serviceType === 'flight').length;
  const hotelOrders = orders.filter((o) => o.serviceType === 'hotel').length;
  const comboOrders = orders.filter((o) => o.serviceType === 'combo').length;

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesTab = selectedTab === 'ALL' || o.serviceType === selectedTab.toLowerCase();
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (o.id && o.id.toLowerCase().includes(q)) ||
        (o.passengerName && o.passengerName.toLowerCase().includes(q)) ||
        (o.fromCity && o.fromCity.toLowerCase().includes(q)) ||
        (o.toCity && o.toCity.toLowerCase().includes(q)) ||
        (o.pnrCode && o.pnrCode.toLowerCase().includes(q));
      return matchesTab && matchesSearch;
    });
  }, [orders, selectedTab, searchQuery]);

  return (
    <div style={{ padding: '1.5rem' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <HiTicket style={{ color: '#2563eb' }} />
            <span>Dummy Tickets & Hotel Booking Desk</span>
          </h1>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
            Manage customer dummy flight ticket itineraries, hotel booking requests, PNR codes & single pricing setup.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchData}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#ffffff', border: '1px solid #cbd5e1', padding: '0.5rem 0.85rem', borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}
        >
          <HiArrowPath size={16} />
          <span>Refresh Desk</span>
        </button>
      </div>

      {/* GLOBAL SINGLE PRICING CONTROL PANEL */}
      <div style={{ background: '#ffffff', borderRadius: '1rem', border: '1px solid #bfdbfe', padding: '1.25rem', marginBottom: '1.5rem', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#1e40af', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <HiCurrencyRupee size={20} />
              <span>Global Single Price Settings (Controls Frontend Prices)</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Set a fixed single price for Dummy Flights and Dummy Hotels. Whatever price you enter here will automatically apply across the user website.
            </span>
          </div>

          {pricingMsg && (
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: pricingMsg.includes('Error') ? '#dc2626' : '#166534', background: pricingMsg.includes('Error') ? '#fee2e2' : '#dcfce7', padding: '0.35rem 0.75rem', borderRadius: '0.4rem' }}>
              {pricingMsg}
            </span>
          )}
        </div>

        <form onSubmit={handleSavePricing} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.35rem' }}>
              ✈️ Dummy Flight Ticket Base Price (₹)
            </label>
            <input
              type="number"
              required
              min={1}
              value={pricing.flightPrice}
              onChange={(e) => setPricing({ ...pricing, flightPrice: Number(e.target.value) })}
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 700, color: '#2563eb' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.35rem' }}>
              🏨 Dummy Hotel Booking Base Price (₹)
            </label>
            <input
              type="number"
              required
              min={1}
              value={pricing.hotelPrice}
              onChange={(e) => setPricing({ ...pricing, hotelPrice: Number(e.target.value) })}
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 700, color: '#16a34a' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.35rem' }}>
              🌟 Combo Saver Package Price (₹)
            </label>
            <input
              type="number"
              required
              min={1}
              value={pricing.comboPrice}
              onChange={(e) => setPricing({ ...pricing, comboPrice: Number(e.target.value) })}
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 700, color: '#8b5cf6' }}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={savingPricing}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                color: '#ffffff',
                padding: '0.65rem 1.25rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)',
              }}
            >
              {savingPricing ? 'Saving...' : '💾 Save Global Dummy Prices'}
            </button>
          </div>
        </form>
      </div>

      {/* METRICS SUMMARY GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#ffffff', padding: '1.1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Ticket Requests</span>
          <h2 style={{ margin: '0.35rem 0 0 0', fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{totalOrders} Orders</h2>
        </div>

        <div style={{ background: '#ffffff', padding: '1.1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>Flight PNR Requests</span>
          <h2 style={{ margin: '0.35rem 0 0 0', fontSize: '1.6rem', fontWeight: 800, color: '#2563eb' }}>{flightOrders} Flights</h2>
        </div>

        <div style={{ background: '#ffffff', padding: '1.1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase' }}>Hotel Booking Requests</span>
          <h2 style={{ margin: '0.35rem 0 0 0', fontSize: '1.6rem', fontWeight: 800, color: '#16a34a' }}>{hotelOrders} Hotels</h2>
        </div>

        <div style={{ background: '#ffffff', padding: '1.1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8b5cf6', textTransform: 'uppercase' }}>Combo Packages</span>
          <h2 style={{ margin: '0.35rem 0 0 0', fontSize: '1.6rem', fontWeight: 800, color: '#8b5cf6' }}>{comboOrders} Combos</h2>
        </div>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div style={{ background: '#ffffff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', border: '1px solid #cbd5e1', padding: '0.55rem 0.85rem', borderRadius: '0.5rem', minWidth: '280px', flex: 1 }}>
          <HiMagnifyingGlass size={18} style={{ color: '#64748b' }} />
          <input
            type="text"
            placeholder="Search by Ref ID, passenger name, route, or PNR code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.875rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {['ALL', 'FLIGHT', 'HOTEL', 'COMBO'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setSelectedTab(tab)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '0.5rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                border: selectedTab === tab ? '1px solid #2563eb' : '1px solid #cbd5e1',
                background: selectedTab === tab ? '#eff6ff' : '#ffffff',
                color: selectedTab === tab ? '#2563eb' : '#475569',
                cursor: 'pointer',
              }}
            >
              {tab === 'ALL' ? 'All Orders' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div style={{ background: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 700 }}>
              <tr>
                <th style={{ padding: '0.85rem 1rem' }}>Order Ref & Date</th>
                <th style={{ padding: '0.85rem 1rem' }}>Service Type</th>
                <th style={{ padding: '0.85rem 1rem' }}>Passenger / Guest</th>
                <th style={{ padding: '0.85rem 1rem' }}>Route & Dates</th>
                <th style={{ padding: '0.85rem 1rem' }}>PNR Code</th>
                <th style={{ padding: '0.85rem 1rem' }}>Paid Fee</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: '#64748b' }}>
                    {loading ? 'Loading dummy ticket requests...' : 'No dummy ticket orders found.'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>{ord.id}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>
                        {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.6rem',
                          borderRadius: '0.35rem',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          background: ord.serviceType === 'flight' ? '#eff6ff' : ord.serviceType === 'hotel' ? '#f0fdf4' : '#f5f3ff',
                          color: ord.serviceType === 'flight' ? '#2563eb' : ord.serviceType === 'hotel' ? '#166534' : '#6d28d9',
                        }}
                      >
                        {ord.serviceType === 'flight' && '✈️ Flight PNR'}
                        {ord.serviceType === 'hotel' && '🏨 Hotel Voucher'}
                        {ord.serviceType === 'combo' && '🌟 Combo Flight+Hotel'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <strong style={{ color: '#0f172a' }}>{ord.passengerName || ord.hotelGuestName || 'N/A'}</strong>
                      {ord.passportNum && (
                        <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>
                          Passport: {ord.passportNum}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {ord.serviceType === 'hotel' ? (
                        <div>
                          <strong>{ord.hotelCity}</strong>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>
                            {ord.checkInDate} ➔ {ord.checkOutDate}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <strong>{ord.fromCity} ➔ {ord.toCity}</strong>
                          <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>
                            Depart: {ord.departDate} {ord.returnDate ? `• Return: ${ord.returnDate}` : ''}
                          </span>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <code style={{ background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontWeight: 800, color: '#2563eb', fontSize: '0.825rem' }}>
                        {ord.pnrCode || 'PNR-PENDING'}
                      </code>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <strong style={{ color: '#166534' }}>{ord.amountPaid || '₹499'}</strong>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 700, background: '#dcfce7', color: '#15803d' }}>
                        {ord.orderStatus || 'CONFIRMED'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenModal(ord)}
                        style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '0.35rem 0.65rem', borderRadius: '0.35rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <HiEye size={14} />
                        <span>Manage Ticket</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MANAGE ORDER MODAL */}
      {selectedOrderModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ background: '#ffffff', width: '100%', maxWidth: '580px', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ background: '#0f172a', color: '#ffffff', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HiTicket style={{ color: '#38bdf8' }} />
                <span>Dummy Ticket Order Dossier ({selectedOrderModal.id})</span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedOrderModal(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.65rem', border: '1px solid #e2e8f0', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
                <div><strong>Passenger / Guest:</strong> {selectedOrderModal.passengerName || selectedOrderModal.hotelGuestName || 'N/A'}</div>
                {selectedOrderModal.passportNum && <div><strong>Passport Number:</strong> {selectedOrderModal.passportNum}</div>}
                <div><strong>Service Requested:</strong> {selectedOrderModal.serviceType.toUpperCase()}</div>
                <div><strong>Route / Destination:</strong> {selectedOrderModal.fromCity} ➔ {selectedOrderModal.toCity || selectedOrderModal.hotelCity}</div>
                <div><strong>Travel Dates:</strong> {selectedOrderModal.departDate} {selectedOrderModal.returnDate ? ` to ${selectedOrderModal.returnDate}` : ''}</div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.35rem' }}>
                  Verifiable 6-Digit Airline PNR Code *
                </label>
                <input
                  type="text"
                  value={editPnrCode}
                  onChange={(e) => setEditPnrCode(e.target.value.toUpperCase())}
                  placeholder="e.g. PNR-PV9841"
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontWeight: 800, color: '#2563eb', fontSize: '1rem' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.35rem' }}>
                  Order Processing Status
                </label>
                <select
                  value={editOrderStatus}
                  onChange={(e) => setEditOrderStatus(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                >
                  <option value="CONFIRMED">CONFIRMED (Live PNR Active)</option>
                  <option value="PENDING_ISSUE">PENDING ISSUE (Processing)</option>
                  <option value="COMPLETED">COMPLETED (Delivered to Customer)</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '0.35rem' }}>
                  Internal Admin / Employee Notes
                </label>
                <textarea
                  rows={3}
                  value={editAdminNotes}
                  onChange={(e) => setEditAdminNotes(e.target.value)}
                  placeholder="Enter employee verification notes, airline ticket number, or remarks..."
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setSelectedOrderModal(null)}
                  style={{ background: '#f1f5f9', color: '#475569', padding: '0.6rem 1.2rem', borderRadius: '0.5rem', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveOrderUpdate}
                  style={{ background: '#2563eb', color: '#ffffff', padding: '0.6rem 1.25rem', borderRadius: '0.5rem', border: 'none', fontWeight: 800, cursor: 'pointer' }}
                >
                  Save Order & PNR Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
