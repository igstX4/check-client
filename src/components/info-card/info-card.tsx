import React from 'react';
import Input from '../ui/input/input';
import CustomSelect from '../ui/custom-select/custom-select';
import { Company } from '../../types/company.types';
import { ArrowLink } from '../svgs/svgs';
import s from './info-card.module.scss';
import { useNavigate } from 'react-router-dom';

interface Field {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  suffix?: string;
  hideArrow?: boolean;
}

interface InfoCardProps {
  title: string;
  editing: boolean;
  fields?: Field[];
  isCustomSelect?: boolean;
  seller?: {
    id: string;
    name: string;
    inn: string;
  };
  sellers?: Array<{
    id: string;
    name: string;
    inn: string;
    type: 'elite' | 'white';
  }>;
  onSellerChange?: (sellerId: string, sellerInn: string) => void;
  companyId?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  editing,
  fields,
  isCustomSelect,
  seller,
  sellers,
  onSellerChange,
  companyId
}) => {
  const navigate = useNavigate();
  // console.log(fields, 1)
  const formatSellersForSelect = () => {
    return sellers?.map(s => ({
      name: s.name,
      inn: s.inn,
      type: s.type === 'elite' ? 'elit' : 'standart'
    })) || [];
  };

  const handleFieldClick = (label: string) => {
    if (editing) return;

    if (title === "ПОКУПАТЕЛЬ") {
      if ((label === "ИНН" || label === "Компания") && companyId) {
        navigate(`/admin/detailed-company/${companyId}`);
      }
    } else if (title === "ПРОДАВЕЦ") {
      navigate('/admin/settings/sellers');
    }
  };

  return (
    <div className={`${s.infoCard} ${editing ? s.editingInfoCard : ""}`}>
      <h2>{title}</h2>
      {isCustomSelect && seller && sellers && onSellerChange ? (
        <>
          <div className={s.infoItem}>
            <p>Компания</p>
            <div className={s.link}>
              {editing ? (
                <CustomSelect
                  companies={formatSellersForSelect()}
                  defaultValue={{
                    name: seller.name,
                    inn: seller.inn,
                    type: 'standart'
                  }}
                  onChange={(selected) => {
                    const originalSeller = sellers.find(s => s.inn === selected.inn);
                    if (originalSeller) {
                      onSellerChange(originalSeller.id, originalSeller.inn);
                    }
                  }}
                />
              ) : (
                <div 
                  onClick={() => navigate('/admin/settings/sellers')}
                  className={s.link}
                  style={{ cursor: 'pointer' }}
                >
                  <h3>{seller.name}</h3>
                  <ArrowLink />
                </div>
              )}
            </div>
          </div>
          <div className={s.infoItem}>
            <p>ИНН</p>
            <div className={s.link}>
              {editing ? (
                <div className={s.editInput}>
                  <Input
                    disabled={true}
                    noMargin={true}
                    value={seller.inn}
                    onChange={() => {}}
                  />
                </div>
              ) : (
                <div 
                  onClick={() => navigate('/admin/settings/sellers')}
                  className={s.link}
                  style={{ cursor: 'pointer' }}
                >
                  <h3>{seller.inn}</h3>
                  <ArrowLink />
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        fields?.map((field, index) => (
          <div key={index} className={s.infoItem}>
            <p>{field.label}</p>
            <div className={`${s.link} ${field.disabled ? s.none : ''} ${field.hideArrow ? s.commission : ''}`}>
              {editing ? (
                <div className={s.editInput}>
                  <Input
                    disabled={field.disabled}
                    noMargin={true}
                    value={field.value}
                    onChange={(e) => field.onChange?.(e.target.value)}
                  />
                </div>
              ) : (
                <>
                  <h3 
                    onClick={() => handleFieldClick(field.label)}
                    style={{ 
                      cursor: !editing && (
                        (title === "ПОКУПАТЕЛЬ" && (field.label === "ИНН" || field.label === "Компания")) || 
                        title === "ПРОДАВЕЦ"
                      ) ? 'pointer' : 'default' 
                    }}
                  >
                    {field.value}{field.suffix}
                  </h3>
                  {!field.hideArrow && <ArrowLink />}
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default InfoCard; 