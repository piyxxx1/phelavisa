import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { API_BASE_URL } from '../config/apiConfig';
import { calculateCategoryTotal, parsePriceNumber, parseTaxNumber } from '../utils/pricingUtils';
import {
  HiArrowLeft,
  HiCheckCircle,
  HiPlus,
  HiTrash,
  HiDocumentText,
  HiQuestionMarkCircle,
  HiCurrencyRupee,
  HiCog6Tooth,
  HiArrowUpTray,
  HiSparkles,
  HiGlobeAsiaAustralia,
  HiBolt,
  HiTicket,
  HiCheck,
} from 'react-icons/hi2';

export const AdminVisaEditPage = ({ visaId: propVisaId, onBack, onSavedSuccess }) => {
  const params = useParams();
  const navigate = useNavigate();
  const { visas, updateVisa, addVisa } = useAdmin();
  
  const effectiveVisaId = propVisaId || params.visaId;
  const isEditing = Boolean(effectiveVisaId);

  const handleGoBack = () => {
    if (onBack) onBack();
    navigate('/visas');
  };

  const handleSaved = () => {
    if (onSavedSuccess) onSavedSuccess();
    navigate('/visas');
  };

  // Active Editor Tab
  const [activeTab, setActiveTab] = useState('specs');

  // Form Fields
  const [id, setId] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('Americas');
  const [flagCode, setFlagCode] = useState('ag');
  const [coverImg, setCoverImg] = useState('https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80');
  const [title, setTitle] = useState('');
  const [visaCategory, setVisaCategory] = useState('TOURIST VISA');
  const [deliveryTime, setDeliveryTime] = useState('This Week');
  const [documents, setDocuments] = useState('Only Passport');

  // Multi-Select Tag Arrays for Advanced Search Filter Matching
  const [deliveryTimeTags, setDeliveryTimeTags] = useState(['This Week']);
  const [typeTags, setTypeTags] = useState(['e-Visa', 'Sticker Visa']);
  const [documentsTags, setDocumentsTags] = useState(['Only Passport']);
  const [regionTags, setRegionTags] = useState(['Europe']);

  const toggleDeliveryTimeTag = (tag) => {
    setDeliveryTimeTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleTypeTag = (tag) => {
    setTypeTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleDocumentsTag = (tag) => {
    setDocumentsTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleRegionTag = (tag) => {
    setRegionTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };
  const [badgeTag, setBadgeTag] = useState('POPULAR CHOICE');
  const [getBy, setGetBy] = useState('19 Aug');
  const [type, setType] = useState('Tourist Visa');
  const [price, setPrice] = useState('₹4,999');
  const [visaPrice, setVisaPrice] = useState('₹3,500');
  const [ourCharges, setOurCharges] = useState('₹999');
  const [taxRate, setTaxRate] = useState('₹499 (18% GST)');
  const [processingTime, setProcessingTime] = useState('5-7 Days');
  const [stayPeriod, setStayPeriod] = useState('30 Days');
  const [validity, setValidity] = useState('180 Days');
  const [entryType, setEntryType] = useState('Single Entry');
  const [popular, setPopular] = useState(false);
  const [feeLabel, setFeeLabel] = useState('Embassy Govt Fee');
  const [express, setExpress] = useState(false);
  const [availableCategories, setAvailableCategories] = useState(['tourist', 'express', 'business']);

  const [customCategories, setCustomCategories] = useState([
    { id: 'tourist', name: 'Tourist Visa', badge: 'Standard Process', visaPrice: '₹3,500', ourCharges: '₹999', taxRate: '₹499 (18% GST)', price: '₹4,998' },
    { id: 'express', name: 'Express eVisa', badge: '24h Fast Track', visaPrice: '₹5,500', ourCharges: '₹1,499', taxRate: '₹999 (18% GST)', price: '₹7,998' },
    { id: 'business', name: 'Business Visa', badge: '1 Year Multiple', visaPrice: '₹10,500', ourCharges: '₹2,499', taxRate: '₹1,999 (18% GST)', price: '₹14,998' },
    { id: 'sticker', name: 'Sticker Visa', badge: 'Embassy Sticker', visaPrice: '₹8,500', ourCharges: '₹1,999', taxRate: '₹1,499 (18% GST)', price: '₹11,998' },
  ]);

  const [newCatName, setNewCatName] = useState('');
  const [newCatBadge, setNewCatBadge] = useState('');

  const handleAddCustomCategory = () => {
    if (!newCatName.trim()) {
      alert('Please enter a category name (e.g. eVisa, Student Visa).');
      return;
    }
    const catId = newCatName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (customCategories.some((c) => c.id === catId)) {
      alert('A category with this name already exists!');
      return;
    }
    const { formattedTotal } = calculateCategoryTotal('₹3,500', '₹999', '₹499 (18% GST)');
    const newCat = {
      id: catId,
      name: newCatName.trim(),
      badge: newCatBadge.trim() || 'Standard Process',
      visaPrice: '₹3,500',
      ourCharges: '₹999',
      taxRate: '₹499 (18% GST)',
      price: formattedTotal,
    };
    setCustomCategories((prev) => [...prev, newCat]);
    setNewCatName('');
    setNewCatBadge('');
  };

  const handleAddPresetCategory = (presetName, presetBadge, visaPrice, ourCharges, taxRate, price) => {
    const catId = presetName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (customCategories.some((c) => c.id === catId || c.name.toLowerCase() === presetName.toLowerCase())) {
      alert(`Category "${presetName}" is already enabled!`);
      return;
    }
    const vP = visaPrice || '₹3,500';
    const oC = ourCharges || '₹999';
    const tR = taxRate || '₹499 (18% GST)';
    const { formattedTotal } = calculateCategoryTotal(vP, oC, tR);
    const newCat = {
      id: catId,
      name: presetName,
      badge: presetBadge || 'Standard Process',
      visaPrice: vP,
      ourCharges: oC,
      taxRate: tR,
      price: price || formattedTotal,
    };
    setCustomCategories((prev) => [...prev, newCat]);
  };

  const handleRemoveCategory = (catId) => {
    if (customCategories.length === 1) {
      alert('At least one Visa Category Option must remain enabled!');
      return;
    }
    setCustomCategories((prev) => prev.filter((c) => c.id !== catId));
  };

  const handleUpdateCategoryField = (catId, field, value) => {
    setCustomCategories((prev) =>
      prev.map((c) => {
        if (c.id === catId) {
          const updated = { ...c, [field]: value };
          const { formattedTotal } = calculateCategoryTotal(
            updated.visaPrice,
            updated.ourCharges,
            updated.taxRate
          );
          updated.price = formattedTotal;
          return updated;
        }
        return c;
      })
    );
  };

  // Document Checklist Items
  const [docChecklist, setDocChecklist] = useState([]);

  // New Document Input
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocDesc, setNewDocDesc] = useState('');
  const [newDocCategorySelect, setNewDocCategorySelect] = useState('Passport & ID');
  const [customDocCatName, setCustomDocCatName] = useState('');
  const [newDocIsRequired, setNewDocIsRequired] = useState(true);
  const [selectedForVisaCat, setSelectedForVisaCat] = useState('all');

  // FAQs Items
  const [faqs, setFaqs] = useState([
    {
      id: 'faq-1',
      question: 'Is a physical interview required for this visa?',
      answer: 'Most tourist visas are processed online without requiring a physical interview.',
    },
    {
      id: 'faq-2',
      question: 'How far in advance should I apply?',
      answer: 'We recommend applying at least 3-4 weeks prior to your intended date of travel.',
    },
  ]);

  // New FAQ Input
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  // Key Specifications Items
  const [keySpecs, setKeySpecs] = useState([
    { id: 'ks-1', label: 'Processing Time', value: '5-7 Days', icon: 'clock' },
    { id: 'ks-2', label: 'Stay Duration', value: '30 Days', icon: 'calendar' },
    { id: 'ks-3', label: 'Visa Validity', value: '180 Days', icon: 'document' },
    { id: 'ks-4', label: 'Entry Type', value: 'Single Entry', icon: 'id' },
  ]);

  // New Key Specification Input
  const [newSpecLabel, setNewSpecLabel] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [newSpecIcon, setNewSpecIcon] = useState('shield');

  // Load existing visa data if editing
  useEffect(() => {
    if (!isEditing || !effectiveVisaId) return;

    const populateVisaData = (existing) => {
      if (!existing) return;
      setId(existing.id || existing._id || '');
      setCountry(existing.country || '');
      setRegion(existing.region || 'Americas');
      setFlagCode(existing.flagCode || 'eu');
      setCoverImg(existing.coverImg || '');
      setTitle(existing.title || '');
      setVisaCategory(existing.visaCategory || 'TOURIST VISA');
      setDeliveryTime(existing.deliveryTime || 'This Week');
      setDocuments(existing.documents || 'Only Passport');
      setBadgeTag(existing.badgeTag || 'POPULAR CHOICE');
      setGetBy(existing.getBy || '19 Aug');
      setType(existing.type || 'Tourist Visa');
      setPrice(existing.price || '₹4,999');
      setProcessingTime(existing.processingTime || '5-7 Days');
      setStayPeriod(existing.stayPeriod || '30 Days');
      setValidity(existing.validity || '180 Days');
      setEntryType(existing.entryType || 'Single Entry');
      setPopular(Boolean(existing.popular));
      setFeeLabel(existing.feeLabel || 'Embassy Govt Fee');
      setExpress(Boolean(existing.express));

      if (existing.deliveryTimeTags && existing.deliveryTimeTags.length > 0) {
        setDeliveryTimeTags(existing.deliveryTimeTags);
      } else if (existing.deliveryTime) {
        setDeliveryTimeTags([existing.deliveryTime]);
      }

      if (existing.typeTags && existing.typeTags.length > 0) {
        setTypeTags(existing.typeTags);
      } else if (existing.type || existing.visaCategory) {
        setTypeTags([existing.type || existing.visaCategory]);
      }

      if (existing.documentsTags && existing.documentsTags.length > 0) {
        setDocumentsTags(existing.documentsTags);
      } else if (existing.documents) {
        setDocumentsTags([existing.documents]);
      }

      if (existing.regionTags && existing.regionTags.length > 0) {
        setRegionTags(existing.regionTags);
      } else if (existing.region) {
        setRegionTags([existing.region]);
      }

      if (existing.customCategories && existing.customCategories.length > 0) {
        setCustomCategories(existing.customCategories);
      }
      if (existing.docChecklist) setDocChecklist(existing.docChecklist);
      if (existing.faqs) setFaqs(existing.faqs);
      if (existing.keySpecs && existing.keySpecs.length > 0) {
        setKeySpecs(existing.keySpecs);
      } else {
        setKeySpecs([
          { id: 'ks-1', label: 'Processing Time', value: existing.processingTime || '5-7 Days', icon: 'clock' },
          { id: 'ks-2', label: 'Stay Duration', value: existing.stayPeriod || '30 Days', icon: 'calendar' },
          { id: 'ks-3', label: 'Visa Validity', value: existing.validity || '180 Days', icon: 'document' },
          { id: 'ks-4', label: 'Entry Type', value: existing.entryType || 'Single Entry', icon: 'id' },
        ]);
      }
    };

    // 1. Instant load from in-memory context state if present
    const existing = visas.find((v) => v.id === effectiveVisaId || v._id === effectiveVisaId);
    if (existing) {
      populateVisaData(existing);
    }

    // 2. Direct API fetch to guarantee fresh database data
    fetch(`${API_BASE_URL}/visas/${effectiveVisaId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) populateVisaData(data);
      })
      .catch((err) => console.warn('[AdminVisaEditPage] API fetch by id error:', err));
  }, [effectiveVisaId, isEditing, visas]);

  // Key Specification Handlers
  const handleAddKeySpec = () => {
    if (!newSpecLabel.trim() || !newSpecValue.trim()) return;
    const newSpec = {
      id: 'ks-' + Date.now(),
      label: newSpecLabel.trim(),
      value: newSpecValue.trim(),
      icon: newSpecIcon,
    };
    setKeySpecs((prev) => [...prev, newSpec]);
    setNewSpecLabel('');
    setNewSpecValue('');
  };

  const handleRemoveKeySpec = (specId) => {
    setKeySpecs((prev) => prev.filter((s) => s.id !== specId));
  };

  // Document Handlers
  const handleAddDocument = () => {
    if (!newDocTitle.trim()) {
      alert('Please enter a document title (e.g. Original Passport, GST Certificate).');
      return;
    }
    const finalCategory =
      newDocCategorySelect === 'custom'
        ? customDocCatName.trim() || 'General Documents'
        : newDocCategorySelect;

    const newItem = {
      id: 'doc-' + Date.now(),
      forVisaCategory: selectedForVisaCat,
      category: finalCategory,
      title: newDocTitle.trim(),
      description: newDocDesc.trim() || 'Required for embassy verification.',
      isRequired: newDocIsRequired,
    };
    setDocChecklist((prev) => [...prev, newItem]);
    setNewDocTitle('');
    setNewDocDesc('');
    setCustomDocCatName('');
  };

  const handleToggleDocRequired = (docId) => {
    setDocChecklist((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, isRequired: !d.isRequired } : d))
    );
  };

  const handleUpdateDocForCategory = (docId, newForCat) => {
    setDocChecklist((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, forVisaCategory: newForCat } : d))
    );
  };

  const handleRemoveDocument = (docId) => {
    setDocChecklist((prev) => prev.filter((d) => d.id !== docId));
  };

  // FAQ Handlers
  const handleAddFaq = () => {
    if (!newFaqQ.trim() || !newFaqA.trim()) return;
    const newFaq = {
      id: 'faq-' + Date.now(),
      question: newFaqQ.trim(),
      answer: newFaqA.trim(),
    };
    setFaqs((prev) => [...prev, newFaq]);
    setNewFaqQ('');
    setNewFaqA('');
  };

  const handleRemoveFaq = (faqId) => {
    setFaqs((prev) => prev.filter((f) => f.id !== faqId));
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview instantly
    const localUrl = URL.createObjectURL(file);
    setCoverImg(localUrl);

    // Send file to Node/Express Multer Upload API
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.fileUrl) {
          setCoverImg(data.fileUrl);
          console.log('✓ Cover image uploaded to server:', data.fileUrl);
        }
      }
    } catch (err) {
      console.warn('Server image upload warning:', err);
    }
  };

  // Save Visa Form Handler
  const handleSaveVisa = async (e) => {
    if (e) e.preventDefault();
    if (!country.trim() || !title.trim()) {
      alert('Please fill in country name and visa title.');
      return;
    }

    const visaIdToUse = id.trim()
      ? id.trim().toLowerCase().replace(/\s+/g, '-')
      : country.trim().toLowerCase().replace(/\s+/g, '-') + '-visa';

    // Enforce strictly 4 fixed system core key specifications
    const updatedKeySpecs = [
      { id: 'ks-1', label: 'Processing Time', value: processingTime || '5-7 Days', icon: 'clock' },
      { id: 'ks-2', label: 'Stay Duration', value: stayPeriod || '30 Days', icon: 'calendar' },
      { id: 'ks-3', label: 'Visa Validity', value: validity || '180 Days', icon: 'document' },
      { id: 'ks-4', label: 'Entry Type', value: entryType || 'Single Entry', icon: 'id' },
    ];

    const finalCustomCategories = customCategories.map((cat) => {
      const { formattedTotal } = calculateCategoryTotal(
        cat.visaPrice,
        cat.ourCharges,
        cat.taxRate
      );
      return {
        ...cat,
        price: formattedTotal,
      };
    });

    // Calculate lowest starting price among all categories for "Starting at" price tag
    const categoryPrices = finalCustomCategories.map((c) => {
      const num = parseInt((c.price || '').replace(/[^0-9]/g, ''), 10);
      return !isNaN(num) && num > 0 ? num : 4999;
    });
    const lowestCategoryPrice = categoryPrices.length > 0 ? Math.min(...categoryPrices) : 4999;
    const startingPriceString = `₹${lowestCategoryPrice.toLocaleString('en-IN')}`;

    const activeCat = finalCustomCategories[0] || {
      price: startingPriceString,
      visaPrice: '₹3,500',
      ourCharges: '₹999',
      taxRate: '₹499 (18% GST)',
    };

    const categoryPricingMap = {};
    for (const c of finalCustomCategories) {
      if (['tourist', 'express', 'business'].includes(c.id)) {
        categoryPricingMap[c.id] = {
          price: c.price,
          visaPrice: c.visaPrice,
          ourCharges: c.ourCharges,
          taxRate: c.taxRate,
        };
      }
    }

    const payload = {
      id: visaIdToUse,
      country: country.trim(),
      region,
      flagCode: flagCode.trim() || 'eu',
      coverImg,
      title: title.trim(),
      visaCategory: typeTags[0] || visaCategory,
      deliveryTime: deliveryTimeTags[0] || deliveryTime,
      documents: documentsTags[0] || documents,
      region: regionTags[0] || region,
      deliveryTimeTags: deliveryTimeTags.length > 0 ? deliveryTimeTags : [deliveryTime],
      typeTags: typeTags.length > 0 ? typeTags : [type],
      documentsTags: documentsTags.length > 0 ? documentsTags : [documents],
      regionTags: regionTags.length > 0 ? regionTags : [region],
      badgeTag,
      getBy,
      type: typeTags[0] || type,
      price: startingPriceString,
      visaPrice: activeCat.visaPrice,
      ourCharges: activeCat.ourCharges,
      taxRate: activeCat.taxRate,
      processingTime,
      stayPeriod,
      validity,
      entryType,
      popular,
      feeLabel,
      express,
      availableCategories: finalCustomCategories.map((c) => c.id),
      customCategories: finalCustomCategories,
      categoryPricing: Object.keys(categoryPricingMap).length > 0 ? categoryPricingMap : undefined,
      docChecklist,
      faqs,
      keySpecs: updatedKeySpecs,
    };

    try {
      if (isEditing) {
        await updateVisa(payload);
      } else {
        await addVisa(payload);
      }
      alert(`🎉 Visa listing for ${country} successfully saved to Database!`);
      handleSaved();
    } catch (err) {
      alert(`❌ Error saving visa listing: ${err.message || 'Server error'}`);
    }
  };

  return (
    <div className="admin-visa-edit-container">
      {/* Top Breadcrumb & Header */}
      <div className="admin-page-header-flex">
        <div>
          <button className="back-link-btn" onClick={handleGoBack}>
            <HiArrowLeft size={16} />
            <span>Back to Listings</span>
          </button>
          <h1 className="admin-page-title">
            {isEditing ? `Edit ${country} Visa Page Details` : 'Create New Visa Listing'}
          </h1>
          <p className="admin-page-subtitle">
            Configure visa specs, add custom required documents, manage FAQs, and set pricing multipliers.
          </p>
        </div>

        <button className="admin-primary-btn" onClick={handleSaveVisa}>
          <HiCheckCircle size={20} />
          <span>{isEditing ? 'Save All Page Changes' : 'Publish New Visa'}</span>
        </button>
      </div>

      {/* Editor Navigation Tabs */}
      <div className="editor-tab-navigation">
        <button
          className={`editor-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
          onClick={() => setActiveTab('specs')}
        >
          <HiCog6Tooth size={18} />
          <span>1. Specs & Page Info</span>
        </button>
        <button
          className={`editor-tab-btn ${activeTab === 'docs' ? 'active' : ''}`}
          onClick={() => setActiveTab('docs')}
        >
          <HiDocumentText size={18} />
          <span>2. Required Documents ({docChecklist.length})</span>
        </button>
        <button
          className={`editor-tab-btn ${activeTab === 'faqs' ? 'active' : ''}`}
          onClick={() => setActiveTab('faqs')}
        >
          <HiQuestionMarkCircle size={18} />
          <span>3. FAQs Manager ({faqs.length})</span>
        </button>
        <button
          className={`editor-tab-btn ${activeTab === 'pricing' ? 'active' : ''}`}
          onClick={() => setActiveTab('pricing')}
        >
          <HiCurrencyRupee size={18} />
          <span>4. Pricing & Multipliers</span>
        </button>
      </div>

      {/* TAB 1: SPECS & PAGE INFORMATION */}
      {activeTab === 'specs' && (
        <form onSubmit={handleSaveVisa} className="admin-content-section-card">
          <h3 className="card-title" style={{ marginBottom: '1.25rem' }}>Basic Visa Listing Specs</h3>

          <div className="form-grid-2col">
            <div className="form-input-block">
              <label>Country Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. France"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>

            <div className="form-input-block">
              <label>Visa Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. France Schengen Tourist Visa"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          {/* Automatic Country Flag Code API Box */}
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '0.85rem', border: '1px solid #cbd5e1', marginBottom: '1.5rem', marginTop: '1rem' }}>
            <label style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <HiGlobeAsiaAustralia size={22} style={{ color: '#2563eb' }} />
              <span>Country Flag API Code (Automatic Flag Generator) *</span>
            </label>
            <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '0.85rem' }}>
              Enter 2-letter Country Alpha Code (e.g. <code>FR</code> for France, <code>IN</code> for India, <code>AE</code> for UAE, <code>TH</code> for Thailand). The flag is fetched automatically via country flag API and displayed on all visa cards!
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', alignItems: 'center' }}>
              <div style={{ flex: '1', minWidth: '220px' }}>
                <input
                  type="text"
                  required
                  maxLength={3}
                  placeholder="e.g. FR, IN, AE, TH..."
                  value={flagCode}
                  onChange={(e) => setFlagCode(e.target.value.toUpperCase())}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    fontSize: '1rem',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    borderRadius: '0.5rem',
                    border: '2px solid #3b82f6',
                    textTransform: 'uppercase',
                    background: '#ffffff',
                  }}
                />
              </div>

              {/* Live Flag Preview Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', background: '#ffffff', padding: '0.5rem 1rem', borderRadius: '0.65rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                <img
                  src={`https://flagcdn.com/w80/${(flagCode || 'fr').toLowerCase()}.png`}
                  alt={`${flagCode} Flag`}
                  style={{ width: '48px', height: '32px', borderRadius: '0.25rem', objectFit: 'cover', border: '1px solid #cbd5e1' }}
                />
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Live Flag Preview:</span>
                  <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{flagCode || 'FR'} Flag ({country || 'Country'})</strong>
                </div>
              </div>
            </div>

            {/* Quick Preset Country Code Chips */}
            <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Quick Presets:</span>
              {[
                { code: 'FR', label: 'France' },
                { code: 'IN', label: 'India' },
                { code: 'AE', label: 'UAE / Dubai' },
                { code: 'TH', label: 'Thailand' },
                { code: 'SG', label: 'Singapore' },
                { code: 'US', label: 'USA' },
                { code: 'GB', label: 'UK' },
                { code: 'JP', label: 'Japan' },
              ].map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setFlagCode(c.code)}
                  style={{
                    background: flagCode === c.code ? '#2563eb' : '#ffffff',
                    color: flagCode === c.code ? '#ffffff' : '#334155',
                    border: '1px solid #cbd5e1',
                    borderRadius: '0.35rem',
                    padding: '0.25rem 0.55rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {c.code} ({c.label})
                </button>
              ))}
            </div>
          </div>

          {/* Modern Ultra-Clean Filter & Search Categorization Settings Card */}
          <div className="cover-upload-section-card" style={{ background: '#ffffff', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', borderRadius: '1rem', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', pb: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <label className="form-label-bold" style={{ color: '#0f172a', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.55rem', margin: 0 }}>
                  <HiGlobeAsiaAustralia size={24} style={{ color: '#2563eb' }} />
                  <span>Search & Filter Categorization (Homepage & Visas Page Sync)</span>
                </label>
                <p style={{ fontSize: '0.825rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
                  Select all categories that apply to <strong>{country || 'this destination'}</strong>. Users filtering by any selected tag will instantly find this listing.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.35rem 0.75rem', borderRadius: '2rem', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }}>
                  {typeTags.length} Types Active
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.35rem 0.75rem', borderRadius: '2rem', background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' }}>
                  {deliveryTimeTags.length} Speeds Active
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {/* Delivery Speed Multi-Select Pill Chips */}
              <div style={{ background: '#f8fafc', padding: '1.1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                <label style={{ color: '#1e293b', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  <HiBolt size={18} style={{ color: '#eab308' }} />
                  <span>Visa Delivery Speed Tags *</span>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {['Within 48 Hrs', 'This Week', 'This Month', '2+ Months'].map((tag) => {
                    const isSelected = deliveryTimeTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleDeliveryTimeTag(tag)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.45rem 0.85rem',
                          borderRadius: '2rem',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          border: isSelected ? '1px solid #eab308' : '1px solid #cbd5e1',
                          background: isSelected ? '#fef9c3' : '#ffffff',
                          color: isSelected ? '#713f12' : '#334155',
                          boxShadow: isSelected ? '0 2px 4px rgba(234, 179, 8, 0.2)' : 'none',
                        }}
                      >
                        {isSelected ? <HiCheckCircle size={15} style={{ color: '#ca8a04' }} /> : <span style={{ opacity: 0.4 }}>+</span>}
                        <span>{tag}</span>
                      </button>
                    );
                  })}
                </div>
                <span className="input-hint-sm" style={{ marginTop: '0.65rem', display: 'block', color: '#64748b' }}>Applies to "Visa Delivery" homepage filter</span>
              </div>

              {/* Visa Format & Type Multi-Select Pill Chips */}
              <div style={{ background: '#f8fafc', padding: '1.1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                <label style={{ color: '#1e293b', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  <HiTicket size={18} style={{ color: '#2563eb' }} />
                  <span>Primary Visa Format / Type Tags *</span>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {['e-Visa', 'Visa on Arrival', 'Sticker Visa'].map((tag) => {
                    const isSelected = typeTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTypeTag(tag)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.45rem 0.85rem',
                          borderRadius: '2rem',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          border: isSelected ? '1px solid #2563eb' : '1px solid #cbd5e1',
                          background: isSelected ? '#2563eb' : '#ffffff',
                          color: isSelected ? '#ffffff' : '#334155',
                          boxShadow: isSelected ? '0 2px 6px rgba(37, 99, 235, 0.25)' : 'none',
                        }}
                      >
                        {isSelected ? <HiCheckCircle size={15} style={{ color: '#ffffff' }} /> : <span style={{ opacity: 0.4 }}>+</span>}
                        <span>{tag}</span>
                      </button>
                    );
                  })}
                </div>
                <span className="input-hint-sm" style={{ marginTop: '0.65rem', display: 'block', color: '#64748b' }}>Applies to "Visa Type" homepage & visas filter</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
              {/* Document Complexity Multi-Select Pill Chips */}
              <div style={{ background: '#f8fafc', padding: '1.1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                <label style={{ color: '#1e293b', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  <HiDocumentText size={18} style={{ color: '#16a34a' }} />
                  <span>Document Complexity Tags *</span>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {['Only Passport', 'Bank Statement Required', 'Invitation Letter'].map((tag) => {
                    const isSelected = documentsTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleDocumentsTag(tag)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.45rem 0.85rem',
                          borderRadius: '2rem',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          border: isSelected ? '1px solid #16a34a' : '1px solid #cbd5e1',
                          background: isSelected ? '#f0fdf4' : '#ffffff',
                          color: isSelected ? '#14532d' : '#334155',
                          boxShadow: isSelected ? '0 2px 4px rgba(22, 163, 74, 0.2)' : 'none',
                        }}
                      >
                        {isSelected ? <HiCheckCircle size={15} style={{ color: '#16a34a' }} /> : <span style={{ opacity: 0.4 }}>+</span>}
                        <span>{tag}</span>
                      </button>
                    );
                  })}
                </div>
                <span className="input-hint-sm" style={{ marginTop: '0.65rem', display: 'block', color: '#64748b' }}>Applies to "Documents" homepage filter</span>
              </div>

              {/* Region Multi-Select Pill Chips */}
              <div style={{ background: '#f8fafc', padding: '1.1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                <label style={{ color: '#1e293b', fontWeight: 700, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  <HiGlobeAsiaAustralia size={18} style={{ color: '#8b5cf6' }} />
                  <span>Region / Geographical Tags *</span>
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {['Europe', 'Asia', 'Middle East', 'Americas', 'Africa', 'Oceania'].map((tag) => {
                    const isSelected = regionTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleRegionTag(tag)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.45rem 0.85rem',
                          borderRadius: '2rem',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          border: isSelected ? '1px solid #8b5cf6' : '1px solid #cbd5e1',
                          background: isSelected ? '#f5f3ff' : '#ffffff',
                          color: isSelected ? '#5b21b6' : '#334155',
                          boxShadow: isSelected ? '0 2px 4px rgba(139, 92, 246, 0.2)' : 'none',
                        }}
                      >
                        {isSelected ? <HiCheckCircle size={15} style={{ color: '#8b5cf6' }} /> : <span style={{ opacity: 0.4 }}>+</span>}
                        <span>{tag}</span>
                      </button>
                    );
                  })}
                </div>
                <span className="input-hint-sm" style={{ marginTop: '0.65rem', display: 'block', color: '#64748b' }}>Applies to "Region" homepage filter</span>
              </div>
            </div>
          </div>

          {/* Dedicated Visa Options & Custom Categories Creator */}
          <div className="cover-upload-section-card" style={{ background: '#f8fafc', borderColor: '#93c5fd' }}>
            <label className="form-label-bold" style={{ color: '#1e3a8a', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HiSparkles size={20} style={{ color: '#2563eb' }} />
              Available Visa Categories & Custom Category Creator for {country || 'this destination'}
            </label>
            <p style={{ fontSize: '0.825rem', color: '#475569', marginBottom: '1rem' }}>
              Create or manage custom visa categories (e.g. <code>eVisa</code>, <code>Business Visa</code>, <code>Student Visa</code>). Every category you add here will automatically generate its own 3-Column Pricing Card in Tab 4.
            </p>

            {/* Currently Active Categories Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              {customCategories.map((cat) => (
                <div
                  key={cat.id}
                  style={{
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    border: '2px solid #2563eb',
                    background: '#eff6ff',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{cat.name}</strong>
                    {customCategories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(cat.id)}
                        style={{
                          background: '#fee2e2',
                          color: '#dc2626',
                          border: 'none',
                          borderRadius: '0.35rem',
                          padding: '0.2rem 0.45rem',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          fontWeight: 700,
                        }}
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>
                  <div style={{ marginTop: '0.4rem' }}>
                    <label style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>Badge Pill Tag:</label>
                    <input
                      type="text"
                      value={cat.badge || ''}
                      onChange={(e) => handleUpdateCategoryField(cat.id, 'badge', e.target.value)}
                      placeholder="e.g. ⚡ 24h, Standard"
                      style={{
                        width: '100%',
                        fontSize: '0.78rem',
                        padding: '0.3rem 0.5rem',
                        borderRadius: '0.35rem',
                        border: '1px solid #cbd5e1',
                        marginTop: '0.15rem',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add Category Presets Bar */}
            <div style={{ marginBottom: '1rem', background: '#eff6ff', padding: '0.85rem', borderRadius: '0.65rem', border: '1px solid #bfdbfe' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e40af', display: 'block', marginBottom: '0.5rem' }}>
                Quick Add Preset Categories:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => handleAddPresetCategory('e-Visa', 'Digital eVisa', '₹3,500', '₹999', '₹499 (18% GST)', '₹4,999')}
                  style={{ background: '#1e40af', color: '#ffffff', border: 'none', borderRadius: '0.35rem', padding: '0.3rem 0.65rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  + e-Visa
                </button>
                <button
                  type="button"
                  onClick={() => handleAddPresetCategory('Visa on Arrival', 'Instant Arrival', '₹2,500', '₹799', '₹399 (18% GST)', '₹3,698')}
                  style={{ background: '#1e40af', color: '#ffffff', border: 'none', borderRadius: '0.35rem', padding: '0.3rem 0.65rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  + Visa on Arrival
                </button>
                <button
                  type="button"
                  onClick={() => handleAddPresetCategory('Sticker Visa', 'Embassy Sticker', '₹8,500', '₹1,999', '₹1,499 (18% GST)', '₹11,999')}
                  style={{ background: '#1e40af', color: '#ffffff', border: 'none', borderRadius: '0.35rem', padding: '0.3rem 0.65rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  + Sticker Visa
                </button>
              </div>
            </div>

            {/* Form to Add New Custom Category */}
            <div style={{ background: '#ffffff', padding: '1rem', borderRadius: '0.75rem', border: '1px dashed #3b82f6' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e40af', display: 'block', marginBottom: '0.5rem' }}>
                Create & Add Custom Visa Category
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Category Name (e.g. eVisa, Tourist Visa, Sticker Visa, Student Visa)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  style={{ flex: 2, minWidth: '180px', padding: '0.55rem 0.75rem', fontSize: '0.85rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}
                />
                <input
                  type="text"
                  placeholder="Badge Tag (e.g. 24h, Embassy Sticker, 1 Year)"
                  value={newCatBadge}
                  onChange={(e) => setNewCatBadge(e.target.value)}
                  style={{ flex: 1, minWidth: '140px', padding: '0.55rem 0.75rem', fontSize: '0.85rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}
                />
                <button
                  type="button"
                  onClick={handleAddCustomCategory}
                  style={{
                    background: '#2563eb',
                    color: '#ffffff',
                    padding: '0.55rem 1.25rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <HiPlus size={16} />
                  <span>Add Category</span>
                </button>
              </div>
            </div>
          </div>

          {/* Dedicated Visa Cover Image Upload Section Card */}
          <div className="cover-upload-section-card">
            <label className="form-label-bold">Visa Cover Image *</label>
            <div className="cover-upload-flex-row">
              <div className="cover-thumbnail-wrapper">
                {coverImg ? (
                  <img src={coverImg} alt="Cover Preview" className="cover-thumbnail-img" />
                ) : (
                  <span className="cover-no-img-text">No Cover Image Uploaded</span>
                )}
              </div>

              <div className="cover-actions-wrapper">
                <div className="upload-btn-row">
                  <label className="upload-cover-file-btn">
                    <HiArrowUpTray size={18} />
                    <span>{coverImg ? 'Change / Upload New Image' : 'Select Image File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden-file-input"
                      onChange={handleCoverImageUpload}
                    />
                  </label>

                  {coverImg && (
                    <button
                      type="button"
                      className="action-delete-btn"
                      onClick={() => setCoverImg('')}
                      style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}
                    >
                      <HiTrash size={16} />
                      <span>Remove Image</span>
                    </button>
                  )}
                </div>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.4rem 0 0 0' }}>
                  Supported formats: JPG, PNG, WEBP, GIF. Uploaded directly to server storage.
                </p>
              </div>
            </div>
          </div>

          {/* Fixed 4 Core Visa Key Specifications Section */}
          <div className="cover-upload-section-card" style={{ background: '#f8fafc', border: '1px solid #3b82f6', borderRadius: '1rem', padding: '1.25rem', marginTop: '1.75rem' }}>
            <label className="form-label-bold" style={{ color: '#1e3a8a', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <HiSparkles size={20} style={{ color: '#2563eb' }} />
              <span>📌 Fixed 4 Core Visa Key Specifications (Synced to Frontend)</span>
            </label>
            <p style={{ fontSize: '0.825rem', color: '#475569', marginBottom: '1.1rem' }}>
              These 4 specification titles (<strong>Processing Time</strong>, <strong>Stay Duration</strong>, <strong>Visa Validity</strong>, <strong>Entry Type</strong>) are fixed system standards. You can edit their detail values anytime below and they will automatically update across all frontend cards and detail pages!
            </p>

            <div className="form-grid-2col">
              <div className="form-input-block" style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '0.65rem', border: '1px solid #cbd5e1' }}>
                <label style={{ fontWeight: 800, fontSize: '0.875rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>⏱️ 1. Processing Time (Fixed Title)</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5-7 Days, 24 Hours, 10 Days..."
                  value={processingTime}
                  onChange={(e) => setProcessingTime(e.target.value)}
                  style={{ marginTop: '0.4rem', fontWeight: 600 }}
                />
              </div>

              <div className="form-input-block" style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '0.65rem', border: '1px solid #cbd5e1' }}>
                <label style={{ fontWeight: 800, fontSize: '0.875rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>📅 2. Stay Duration (Fixed Title)</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 30 Days, 60 Days, 90 Days..."
                  value={stayPeriod}
                  onChange={(e) => setStayPeriod(e.target.value)}
                  style={{ marginTop: '0.4rem', fontWeight: 600 }}
                />
              </div>
            </div>

            <div className="form-grid-2col" style={{ marginTop: '1rem' }}>
              <div className="form-input-block" style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '0.65rem', border: '1px solid #cbd5e1' }}>
                <label style={{ fontWeight: 800, fontSize: '0.875rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>📑 3. Visa Validity (Fixed Title)</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 180 Days, 1 Year, 6 Months..."
                  value={validity}
                  onChange={(e) => setValidity(e.target.value)}
                  style={{ marginTop: '0.4rem', fontWeight: 600 }}
                />
              </div>

              <div className="form-input-block" style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '0.65rem', border: '1px solid #cbd5e1' }}>
                <label style={{ fontWeight: 800, fontSize: '0.875rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>🪪 4. Entry Type (Fixed Title)</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Single Entry, Multiple Entry, Double Entry..."
                  value={entryType}
                  onChange={(e) => setEntryType(e.target.value)}
                  style={{ marginTop: '0.4rem', fontWeight: 600 }}
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: REQUIRED DOCUMENTS MANAGER */}
      {activeTab === 'docs' && (
        <div className="admin-content-section-card">
          <div className="card-header-flex">
            <div>
              <h3 className="card-title">Manage Required Documents Checklist</h3>
              <span className="card-subtitle">Configure independent document requirements for each visa category option (Tourist, Express, Business, Custom) for {country || 'this visa'}.</span>
            </div>
          </div>

          {/* Visa Category Scope Selector Bar */}
          <div style={{ background: '#eff6ff', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #bfdbfe', marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e40af', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
              <HiCheckCircle size={18} style={{ color: '#2563eb' }} />
              <span>Configure Documents Specifically For Category:</span>
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setSelectedForVisaCat('all')}
                style={{
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  borderRadius: '0.5rem',
                  border: selectedForVisaCat === 'all' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: selectedForVisaCat === 'all' ? '#2563eb' : '#ffffff',
                  color: selectedForVisaCat === 'all' ? '#ffffff' : '#334155',
                  cursor: 'pointer',
                }}
              >
                All Visa Categories (Common Documents)
              </button>

              {customCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedForVisaCat(cat.id)}
                  style={{
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    borderRadius: '0.5rem',
                    border: selectedForVisaCat === cat.id ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    background: selectedForVisaCat === cat.id ? '#2563eb' : '#ffffff',
                    color: selectedForVisaCat === cat.id ? '#ffffff' : '#334155',
                    cursor: 'pointer',
                  }}
                >
                  {cat.name} Documents Only
                </button>
              ))}
            </div>
          </div>

          {/* Add New Document Form */}
          <div className="add-item-box" style={{ background: '#f8fafc', borderColor: '#bfdbfe' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h4 className="add-box-title" style={{ color: '#1e3a8a', margin: 0 }}>+ Add New Document Requirement</h4>
            </div>
            
            <div className="form-grid-2col" style={{ marginBottom: '0.85rem' }}>
              <div className="form-input-block">
                <label style={{ color: '#1e40af', fontWeight: 700 }}>Attach Document To Visa Category *</label>
                <select
                  value={selectedForVisaCat}
                  onChange={(e) => setSelectedForVisaCat(e.target.value)}
                  className="form-select-input"
                  style={{ border: '2px solid #3b82f6', background: '#eff6ff', fontWeight: 700 }}
                >
                  <option value="all">All Visa Categories (Common Document)</option>
                  {customCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} Only
                    </option>
                  ))}
                </select>
                <span className="input-hint-sm">Select which specific visa category requires this document</span>
              </div>

              <div className="form-input-block">
                <label>Document Group Category *</label>
                <select
                  value={newDocCategorySelect}
                  onChange={(e) => setNewDocCategorySelect(e.target.value)}
                  className="form-select-input"
                >
                  <option value="Passport & ID">Passport & ID</option>
                  <option value="Bank & Employment Proof">Bank & Employment Proof</option>
                  <option value="Flight & Hotel Booking">Flight & Hotel Booking</option>
                  <option value="Sponsorship & Invitation">Sponsorship & Invitation</option>
                  <option value="Business Documents">Business Documents</option>
                  <option value="custom">Type Custom Category...</option>
                </select>
              </div>
            </div>

            {newDocCategorySelect === 'custom' && (
              <div className="form-input-block" style={{ marginBottom: '0.85rem' }}>
                <label>Custom Group Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Student Proof, Property Documents"
                  value={customDocCatName}
                  onChange={(e) => setCustomDocCatName(e.target.value)}
                />
              </div>
            )}

            <div className="form-input-block" style={{ marginBottom: '0.85rem' }}>
              <label>Requirement Type *</label>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.35rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#991b1b', background: '#fee2e2', padding: '0.4rem 0.75rem', borderRadius: '0.5rem' }}>
                  <input
                    type="radio"
                    name="docReqType"
                    checked={newDocIsRequired === true}
                    onChange={() => setNewDocIsRequired(true)}
                  />
                  Mandatory (Required)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: '#0369a1', background: '#e0f2fe', padding: '0.4rem 0.75rem', borderRadius: '0.5rem' }}>
                  <input
                    type="radio"
                    name="docReqType"
                    checked={newDocIsRequired === false}
                    onChange={() => setNewDocIsRequired(false)}
                  />
                  Optional
                </label>
              </div>
            </div>

            <div className="form-grid-2col" style={{ marginBottom: '1rem' }}>
              <div className="form-input-block">
                <label>Document Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Original Passport, GST Certificate, ITR-V"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                />
              </div>

              <div className="form-input-block">
                <label>Description / Specification</label>
                <input
                  type="text"
                  placeholder="e.g. Valid for 6 months beyond stay with 2 blank pages."
                  value={newDocDesc}
                  onChange={(e) => setNewDocDesc(e.target.value)}
                />
              </div>
            </div>

            <button type="button" className="add-btn-small" onClick={handleAddDocument} style={{ background: '#2563eb', color: '#fff' }}>
              <HiPlus size={16} />
              <span>Add Document Requirement</span>
            </button>
          </div>

          {/* Current Documents List */}
          <div className="checklist-items-list">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h4 className="list-heading" style={{ margin: 0 }}>
                Current Document Checklist ({docChecklist.length})
              </h4>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Showing: {selectedForVisaCat === 'all' ? 'All Categories' : customCategories.find(c => c.id === selectedForVisaCat)?.name}
              </span>
            </div>

            {docChecklist.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic', margin: '0.5rem 0 1rem' }}>
                No document requirements added yet. Fill out the fields above and click "+ Add Document Requirement".
              </p>
            ) : (
              docChecklist
                .filter((doc) => selectedForVisaCat === 'all' || !doc.forVisaCategory || doc.forVisaCategory === 'all' || doc.forVisaCategory === selectedForVisaCat)
                .map((doc) => {
                  const targetCatName = doc.forVisaCategory === 'all' || !doc.forVisaCategory
                    ? 'All Visa Categories'
                    : customCategories.find(c => c.id === doc.forVisaCategory)?.name || doc.forVisaCategory;

                  return (
                    <div key={doc.id} className="checklist-item-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                      <div className="item-left-info" style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '0.25rem', background: '#fef3c7', color: '#92400e', fontWeight: 700 }}>
                            For: {targetCatName}
                          </span>
                          <span className="doc-cat-tag mandatory" style={{ background: '#e2e8f0', color: '#334155', fontWeight: 700 }}>
                            {doc.category || 'Passport & ID'}
                          </span>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '0.25rem',
                              fontWeight: 700,
                              background: doc.isRequired ? '#fee2e2' : '#e0f2fe',
                              color: doc.isRequired ? '#991b1b' : '#0369a1',
                            }}
                          >
                            {doc.isRequired ? 'Mandatory' : 'Optional'}
                          </span>
                        </div>
                        <strong className="doc-title-text" style={{ fontSize: '0.95rem', color: '#0f172a' }}>{doc.title}</strong>
                        <p className="doc-desc-text" style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.15rem 0 0 0' }}>{doc.description}</p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <select
                          value={doc.forVisaCategory || 'all'}
                          onChange={(e) => handleUpdateDocForCategory(doc.id, e.target.value)}
                          style={{ fontSize: '0.75rem', padding: '0.3rem', borderRadius: '0.35rem', border: '1px solid #cbd5e1' }}
                        >
                          <option value="all">All Visa Categories</option>
                          {customCategories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => handleToggleDocRequired(doc.id)}
                          style={{
                            padding: '0.35rem 0.5rem',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            borderRadius: '0.35rem',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            cursor: 'pointer',
                          }}
                        >
                          {doc.isRequired ? 'Make Optional' : 'Make Mandatory'}
                        </button>
                        <button
                          type="button"
                          className="action-delete-btn"
                          onClick={() => handleRemoveDocument(doc.id)}
                          title="Delete Requirement"
                        >
                          <HiTrash size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })
            )}
          </div>

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" className="admin-primary-btn" onClick={handleSaveVisa}>
              <HiCheckCircle size={18} />
              <span>Save Document Checklist to Database</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: FAQS MANAGER */}
      {activeTab === 'faqs' && (
        <div className="admin-content-section-card">
          <div className="card-header-flex">
            <div>
              <h3 className="card-title">Manage Visa FAQs & Questions</h3>
              <span className="card-subtitle">Configure Q&A items displayed on the visa detail page</span>
            </div>
          </div>

          {/* Add New FAQ Form */}
          <div className="add-item-box">
            <h4 className="add-box-title">+ Add New FAQ Question</h4>
            <div className="form-input-block" style={{ marginBottom: '0.85rem' }}>
              <label>Question *</label>
              <input
                type="text"
                placeholder="e.g. What is the minimum bank balance required?"
                value={newFaqQ}
                onChange={(e) => setNewFaqQ(e.target.value)}
              />
            </div>

            <div className="form-input-block" style={{ marginBottom: '1rem' }}>
              <label>Answer *</label>
              <textarea
                rows={2}
                placeholder="e.g. Applicants should show minimum ₹1.5L to ₹3L in their bank account."
                value={newFaqA}
                onChange={(e) => setNewFaqA(e.target.value)}
                className="form-textarea-input"
              />
            </div>

            <button type="button" className="add-btn-small" onClick={handleAddFaq}>
              <HiPlus size={16} />
              <span>Add FAQ Question</span>
            </button>
          </div>

          {/* FAQ List */}
          <div className="faq-items-list">
            <h4 className="list-heading">Current FAQs ({faqs.length})</h4>
            {faqs.map((faq) => (
              <div key={faq.id} className="faq-item-editor-card">
                <div className="faq-editor-body">
                  <strong className="faq-q-text">Q: {faq.question}</strong>
                  <p className="faq-a-text">A: {faq.answer}</p>
                </div>
                <button
                  type="button"
                  className="action-delete-btn"
                  onClick={() => handleRemoveFaq(faq.id)}
                >
                  <HiTrash size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PRICING & TAXES */}
      {activeTab === 'pricing' && (
        <div className="admin-content-section-card">
          <div className="card-header-flex" style={{ marginBottom: '1.25rem' }}>
            <div>
              <h3 className="card-title">Visa Pricing & Tax Breakdown Settings</h3>
              <span className="card-subtitle">Configure independent 3-Column Pricing (Visa Price, Our Charges, Tax) for each visa category created in Tab 1.</span>
            </div>
          </div>

          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.5rem', color: '#92400e' }}>Choose the Label for "Visa Price" (Applies to all variants):</label>
            <select 
              value={feeLabel} 
              onChange={(e) => setFeeLabel(e.target.value)} 
              style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #fcd34d', background: '#fff', minWidth: '250px' }}
            >
              <option value="Embassy Govt Fee">Embassy Govt Fee</option>
              <option value="Appointment Fees">Appointment Fees</option>
            </select>
            <p style={{ fontSize: '0.8rem', color: '#b45309', margin: '0.5rem 0 0 0' }}>This updates the label text below and across the frontend website.</p>
          </div>


          {customCategories.map((cat) => {
            const { vP, oC, tR, total: computedTotal, formattedTotal } = calculateCategoryTotal(
              cat.visaPrice,
              cat.ourCharges,
              cat.taxRate
            );
            const subtotal = vP + oC;
            const autoGstAmt = Math.round(subtotal * 0.18);

            return (
              <div
                key={cat.id}
                style={{
                  marginBottom: '2rem',
                  padding: '1.5rem',
                  borderRadius: '1rem',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', pb: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="variant-badge" style={{ background: '#dbeafe', color: '#1e40af', fontWeight: 700 }}>
                      {cat.badge || 'Standard Process'}
                    </span>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', fontWeight: 700 }}>
                      {cat.name} Pricing & Fee Breakdown
                    </h4>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '0.4rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Total {cat.name} Fee: </span>
                    <strong style={{ fontSize: '1.1rem', color: '#2563eb' }}>
                      {formattedTotal}
                    </strong>
                  </div>
                </div>

                <div className="form-grid-3col">
                  <div className="form-input-block">
                    <label>1. Visa Price ({feeLabel}) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ₹3,500"
                      value={cat.visaPrice || ''}
                      onChange={(e) => handleUpdateCategoryField(cat.id, 'visaPrice', e.target.value)}
                    />
                    <span className="input-hint-sm">Official embassy & government visa fee</span>
                  </div>

                  <div className="form-input-block">
                    <label>2. Our Charges (PehlaVisa Service Fee) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ₹999"
                      value={cat.ourCharges || ''}
                      onChange={(e) => handleUpdateCategoryField(cat.id, 'ourCharges', e.target.value)}
                    />
                    <span className="input-hint-sm">Document verification, portal SLA & service charge</span>
                  </div>

                  <div className="form-input-block">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ margin: 0 }}>3. Tax (GST / Amount) *</label>
                      <button
                        type="button"
                        onClick={() => {
                          handleUpdateCategoryField(cat.id, 'taxRate', `₹${autoGstAmt.toLocaleString('en-IN')} (18% GST)`);
                        }}
                        style={{
                          background: '#eff6ff',
                          color: '#2563eb',
                          border: '1px solid #bfdbfe',
                          borderRadius: '0.35rem',
                          padding: '0.15rem 0.45rem',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                        title="Click to calculate exact 18% GST"
                      >
                        ⚡ Auto 18% GST (₹{autoGstAmt.toLocaleString('en-IN')})
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ₹500 or 18% GST"
                      value={cat.taxRate || ''}
                      onChange={(e) => handleUpdateCategoryField(cat.id, 'taxRate', e.target.value)}
                    />
                    <span className="input-hint-sm">GST rate or fixed tax amount</span>
                  </div>
                </div>

                {/* Pricing Breakdown Preview Box */}
                <div className="pricing-summary-breakdown-box" style={{ marginTop: '1rem', background: '#f8fafc' }}>
                  <h5 className="breakdown-title-sm" style={{ color: '#475569', fontSize: '0.75rem' }}>
                    {cat.name.toUpperCase()} FRONTEND FEE BREAKDOWN (Total: {formattedTotal}):
                  </h5>
                  <div className="breakdown-grid-3col">
                    <div className="breakdown-col-card">
                      <span className="col-label">Visa Price ({feeLabel})</span>
                      <strong className="col-value-price">₹{vP.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="plus-divider-symbol">+</div>
                    <div className="breakdown-col-card">
                      <span className="col-label">Our Charges (Service Fee)</span>
                      <strong className="col-value-price">₹{oC.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="plus-divider-symbol">+</div>
                    <div className="breakdown-col-card">
                      <span className="col-label">Tax / GST Amount</span>
                      <strong className="col-value-price">₹{tR.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
