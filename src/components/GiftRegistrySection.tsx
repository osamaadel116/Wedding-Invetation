import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, CreditCard, Copy, Check, QrCode, ExternalLink, Heart, X, Sparkles } from 'lucide-react';
import { BankAccount, GiftRegistryItem, FloralTheme } from '../types';
import { WatercolorDivider } from './WatercolorFlorals';

interface GiftRegistrySectionProps {
  accounts: BankAccount[];
  registries: GiftRegistryItem[];
  theme: FloralTheme;
}

export const GiftRegistrySection: React.FC<GiftRegistrySectionProps> = ({
  accounts,
  registries,
  theme,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeQrModal, setActiveQrModal] = useState<BankAccount | null>(null);

  const handleCopyAccount = (id: string, num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="gifts" className="relative py-16 px-4 sm:px-6 bg-[#FCFAF6] overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Section Header */}
        <div className="mb-8">
          <span className="text-xs font-sans-body uppercase tracking-[0.25em] text-[#8C7A6B] font-semibold">
            Token of Love
          </span>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#2E2420] mt-1">
            Wedding Gift & Registry
          </h2>
          <h3 dir="rtl" className="font-serif-display text-2xl sm:text-3xl font-bold text-[#2E2420] mt-1 mb-2" style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}>
            سجل هدايا الزفاف
          </h3>
          <p className="font-sans-body text-xs sm:text-sm text-[#736357] max-w-lg mx-auto mt-2 leading-relaxed">
            Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift, a digital contribution or registry item would be warmly appreciated.
          </p>
          <WatercolorDivider tone={theme.floralTone} className="my-4" />
        </div>

        {/* Bank Accounts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 text-left">
          {(accounts || []).map((acc) => (
            <motion.div
              key={acc.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#FAF7F2] border border-[#E6DCce] rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between"
            >
              {/* Top Bank Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-sans-body uppercase tracking-wider font-semibold text-[#8C6D3B] bg-[#EFE8DD] px-3 py-1 rounded-full">
                    {acc.badge || 'Bank Transfer'}
                  </span>
                  <CreditCard className="w-5 h-5 text-[#C5A059]" />
                </div>

                <h3 className="font-serif-display text-xl font-bold text-[#2E2420]">
                  {acc.bankName}
                </h3>
                <p className="text-xs text-[#8C7A6B] font-serif-display mb-3">
                  a/n {acc.accountHolder}
                </p>

                {/* Account Number Box */}
                <div className="p-3 bg-white rounded-xl border border-[#DCD0C0] flex items-center justify-between my-2 shadow-xs">
                  <span className="font-mono text-base font-bold text-[#2E2420] tracking-wider">
                    {acc.accountNumber}
                  </span>
                  <button
                    onClick={() => handleCopyAccount(acc.id, acc.accountNumber)}
                    className="p-1.5 rounded-lg text-[#8C6D3B] hover:bg-[#FAF7F2] transition-colors"
                    title="Copy Account Number"
                  >
                    {copiedId === acc.id ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#EAE0D2] flex items-center justify-between mt-3">
                <button
                  onClick={() => handleCopyAccount(acc.id, acc.accountNumber)}
                  className="text-xs font-sans-body text-[#8C6D3B] font-semibold hover:underline"
                >
                  {copiedId === acc.id ? '✓ Copied to clipboard' : 'Copy Number'}
                </button>

                {acc.qrCodeUrl && (
                  <button
                    onClick={() => setActiveQrModal(acc)}
                    className="flex items-center gap-1 text-xs font-sans-body text-[#73572C] bg-[#F2EADB] px-3 py-1 rounded-full hover:bg-[#EAE0D0] transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Show QR Code</span>
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* External Registry Items */}
        {registries && registries.length > 0 && (
          <div className="bg-[#FAF7F2] border border-[#E6DCce] rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-sm">
            <h3 className="font-serif-display text-lg font-bold text-[#2E2420] mb-4 flex items-center justify-center gap-2">
              <Gift className="w-5 h-5 text-[#C5A059]" />
              <span>Wishlist & Online Registries</span>
            </h3>

            <div className="space-y-3 text-left">
              {(registries || []).map((reg, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white border border-[#DCD0C0] flex items-center justify-between gap-3 shadow-xs hover:border-[#C5A059] transition-colors"
                >
                  <div>
                    <h4 className="font-serif-display font-bold text-base text-[#2E2420]">
                      {reg.title}
                    </h4>
                    <p className="text-xs text-[#7A6B60] font-sans-body mt-0.5">
                      {reg.description}
                    </p>
                  </div>
                  <a
                    href={reg.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-sans-body font-semibold shadow-xs"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* QR Code Lightbox Modal */}
      <AnimatePresence>
        {activeQrModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveQrModal(null)}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FCFAF6] rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center border border-[#E6DCce] shadow-2xl relative"
            >
              <button
                onClick={() => setActiveQrModal(null)}
                className="absolute top-4 right-4 p-2 text-[#8C7A6B] hover:text-[#2E2420]"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-serif-display text-xl font-bold text-[#2E2420] mt-2">
                {activeQrModal.bankName} QRIS
              </h3>
              <p className="text-xs text-[#8C7A6B] font-serif-display mb-4">
                a/n {activeQrModal.accountHolder}
              </p>

              <div className="p-3 bg-white rounded-2xl border-2 border-[#DFC186] inline-block shadow-inner mb-4">
                <img
                  src={activeQrModal.qrCodeUrl}
                  alt="QR Code"
                  referrerPolicy="no-referrer"
                  className="w-48 h-48 object-contain"
                />
              </div>

              <p className="text-[11px] text-[#7A6B60] font-sans-body">
                Scan via any banking app or e-wallet (BCA, Mandiri, GoPay, OVO, ShopeePay)
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
