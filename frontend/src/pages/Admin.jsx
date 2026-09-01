import { useState } from 'react';
import { Plus, Trash2, User, Phone, Mail, Briefcase } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

function Admin() {
  const { t } = useLanguage();
  const [lawyers, setLawyers] = useState([
    {
      id: 1,
      name: 'Adv. Rajesh Kumar',
      experience: '15 years',
      phone: '+91 98765 43210',
      email: 'rajesh.kumar@law.com',
      specialties: ['Criminal Law', 'Civil Law'],
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    experience: '',
    phone: '',
    email: '',
    specialties: '',
  });

  const handleAdd = () => {
    if (!formData.name || !formData.experience) {
      alert('Please fill in at least name and experience');
      return;
    }

    const newLawyer = {
      id: Date.now(),
      name: formData.name,
      experience: formData.experience,
      phone: formData.phone || 'N/A',
      email: formData.email || 'N/A',
      specialties: formData.specialties
        ? formData.specialties.split(',').map((s) => s.trim())
        : [],
    };

    setLawyers([...lawyers, newLawyer]);
    setFormData({ name: '', experience: '', phone: '', email: '', specialties: '' });
    setShowAddForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm(t('admin.confirmDelete'))) {
      setLawyers(lawyers.filter((lawyer) => lawyer.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-heading text-4xl font-bold text-gray-900 mb-2">
              {t('admin.title')}
            </h1>
            <p className="text-gray-600">{t('admin.subtitle')}</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            {t('admin.addLawyer')}
          </button>
        </div>

        {/* Add Lawyer Form */}
        {showAddForm && (
          <div className="card mb-8">
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">
              {t('admin.addNewLawyer')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin.name')} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Adv. Full Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin.experience')} *
                </label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g., 10 years"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin.phone')}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin.email')}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="email@example.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin.specialties')}
                </label>
                <input
                  type="text"
                  value={formData.specialties}
                  onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                  className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Criminal Law, Civil Law"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleAdd} className="btn-primary">
                {t('admin.addLawyer')}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ name: '', experience: '', phone: '', email: '', specialties: '' });
                }}
                className="btn-secondary"
              >
                {t('admin.cancel')}
              </button>
            </div>
          </div>
        )}

        {/* Lawyers List */}
        <div className="space-y-4">
          {lawyers.map((lawyer) => (
            <div key={lawyer.id} className="card">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center text-white mr-4">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-bold text-gray-900 mb-1">
                        {lawyer.name}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm mb-2">
                        <Briefcase className="h-4 w-4 mr-1" />
                        <span>{lawyer.experience}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center text-gray-600 text-sm">
                          <Phone className="h-4 w-4 mr-2" />
                          <span>{lawyer.phone}</span>
                        </div>
                        <div className="flex items-center text-gray-600 text-sm">
                          <Mail className="h-4 w-4 mr-2" />
                          <span>{lawyer.email}</span>
                        </div>
                      </div>
                      {lawyer.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {lawyer.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(lawyer.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title={t('admin.delete')}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}

          {lawyers.length === 0 && (
            <div className="card text-center py-12">
              <p className="text-gray-500">{t('admin.noLawyers')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;
