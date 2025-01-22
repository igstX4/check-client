import React, { FC, useState, useEffect } from 'react'
import s from './add-check-modal.module.scss'
import Button from '../../ui/button/button'
import Modal from '../../ui/modal/modal'
import Input from '../../ui/input/input'
import DateSelector from '../../ui/date-selector/date-selector'

interface CheckData {
  id?: string;
  date: string;
  product: string;
  unit: string;
  quantity: string;
  priceWithVAT: string;
  totalWithVAT: string;
  vat20: string;
}

interface Props {
  isOpened: boolean;
  setOpen: (isOpen: boolean) => void;
  editData?: CheckData; // Данные для редактирования
  onSubmit: (data: CheckData) => void; // Колбэк для сохранения/добавления
}

const AddCheckModal: FC<Props> = ({
  isOpened,
  setOpen,
  editData,
  onSubmit
}) => {
  const [date, setDate] = useState('');
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [priceWithVat, setPriceWithVat] = useState('');
  const [totalWithVat, setTotalWithVat] = useState('');
  const [vat, setVat] = useState('');
  // console.log(editData, 'editData')
  // Форматирование числа для отображения
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true // Это добавит разделители для тысяч
    }).format(num);
  };

  // Заполняем форму данными при редактировании
  useEffect(() => {
    if (editData) {
      setDate(editData.date);
      setProduct(editData.product);
      setQuantity(editData.quantity);
      setUnit(editData.unit);
      // Убираем только символ рубля и пробелы, сохраняем запятую
      setPriceWithVat(editData.priceWithVAT.replace(/[₽\s]/g, '')); 
      setTotalWithVat(editData.totalWithVAT.replace(/[₽\s]/g, ''));
      setVat(editData.vat20.replace(/[₽\s]/g, ''));
    }
  }, [editData]);

  // Сброс формы при закрытии
  useEffect(() => {
    if (!isOpened) {
      setDate('');
      setProduct('');
      setQuantity('');
      setUnit('');
      setPriceWithVat('');
      setTotalWithVat('');
      setVat('');
    }
  }, [isOpened]);

  // Очистка строки от форматирования для вычислений
  const cleanNumberString = (str: string): number => {
    // Убираем все пробелы, символ рубля и преобразуем запятую в точку
    const cleaned = str.replace(/[₽\s]/g, '').replace(',', '.');
    // console.log('cleanNumberString input:', str, 'cleaned:', cleaned, 'parsed:', parseFloat(cleaned));
    return parseFloat(cleaned) || 0;
  };

  // Расчет общей суммы с НДС
  const calculateTotalWithVat = (quantity: string, priceWithVat: string) => {
    const qty = cleanNumberString(quantity);
    const price = cleanNumberString(priceWithVat);
    return qty * price;
  };

  // Расчет НДС (20% от суммы с НДС)
  const calculateVat = (totalWithVat: number) => {
    // НДС составляет 20/120 от суммы с НДС
    return totalWithVat * (20 / 120);
  };

  // В useEffect для обновления значений при вводе
  useEffect(() => {
    if (quantity && priceWithVat) {
      // console.log('Input values:', { quantity, priceWithVat });
      
      const total = calculateTotalWithVat(quantity, priceWithVat);
      const vatAmount = total * 0.2;

      // console.log('Calculated values:', { total, vatAmount });
      
      const formattedTotal = formatNumber(total);
      const formattedVat = formatNumber(vatAmount);
      
      // console.log('Formatted values:', { formattedTotal, formattedVat });

      setTotalWithVat(formattedTotal);
      setVat(formattedVat);
    } else {
      setTotalWithVat('0,00');
      setVat('0,00');
    }
  }, [quantity, priceWithVat]);

  const handleDateChange = (startDate: string) => {
    setDate(startDate);
  };

  // Обработчики изменения полей
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Разрешаем цифры, одну запятую и одну точку
    const value = e.target.value.replace(/[^\d.,]/g, '');
    
    // Заменяем точку на запятую
    const normalizedValue = value.replace('.', ',');
    
    // Проверяем, что запятая только одна
    const parts = normalizedValue.split(',');
    if (parts.length > 2) {
      return;
    }
    
    // Ограничиваем количество цифр после запятой
    if (parts[1] && parts[1].length > 2) {
      return;
    }
    
    setQuantity(normalizedValue);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Разрешаем цифры, одну запятую и одну точку
    const value = e.target.value.replace(/[^\d.,]/g, '');
    
    // Заменяем точку на запятую
    const normalizedValue = value.replace('.', ',');
    
    // Проверяем, что запятая только одна
    const parts = normalizedValue.split(',');
    if (parts.length > 2) {
      return;
    }
    
    // Ограничиваем количество цифр после запятой
    if (parts[1] && parts[1].length > 2) {
      return;
    }
    
    setPriceWithVat(normalizedValue);
  };

  const handleSubmit = () => {
    if (!date || !product || !quantity || !unit || !priceWithVat) {
      addNotification('Заполните все поля', 'error');
      return;
    }

    // console.log('Submit values:', { quantity, priceWithVat });

    const quantityNum = cleanNumberString(quantity);
    const priceNum = cleanNumberString(priceWithVat);
    
    // console.log('Parsed numbers:', { quantityNum, priceNum });
    
    const totalNum = quantityNum * priceNum;
    const vatNum = totalNum * 0.2;
    
    // console.log('Calculated totals:', { totalNum, vatNum });

    const formattedPrice = formatNumber(priceNum);
    const formattedTotal = formatNumber(totalNum);
    const formattedVat = formatNumber(vatNum);
    
    // console.log('Formatted values:', { formattedPrice, formattedTotal, formattedVat });

    const checkData = {
      date,
      product,
      unit,
      quantity: quantity,
      priceWithVAT: `${formattedPrice} ₽`,
      totalWithVAT: `${formattedTotal} ₽`,
      vat20: `${formattedVat} ₽`
    };

    // console.log('Final check data:', checkData);

    onSubmit(checkData);
    setOpen(false);
  };

  return (
    <Modal
      title={editData ? "Редактирование чека" : "Новый чек"}
      setOpen={setOpen}
      isOpened={isOpened}
      maxWidth
    >
      <div className={s.content}>
        <DateSelector
          onDateChange={handleDateChange}
          fullWidth={true}
          closeOnClickOutside={true}
          singleDate
          inputStyle
          label="Дата"
          value={date}
        />

        <Input
          label="Товар"
          placeholder="Введите название товара"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
        />

        <div className={s.row}>
          <Input
            label="Количество"
            placeholder="0"
            value={quantity}
            onChange={handleQuantityChange}
          />
          <Input
            label="Единица измерения"
            placeholder="шт"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
        </div>

        <Input
          label="Цена за единицу с НДС"
          placeholder="0,00 ₽"
          noMargin={true}
          value={priceWithVat}
          onChange={handlePriceChange}
        />

        <div className={s.separator}>
          <p>Поля ниже заполняются автоматически</p>
        </div>

        <div className={s.row}>
          <Input
            label="Стоимость с НДС"
            value={`${totalWithVat} ₽`}
            disabled
          />
          <Input
            label="НДС 20%"
            value={`${vat} ₽`}
            disabled
          />
        </div>
      </div>

      <div className={s.actions}>
        <Button
          label="Отмена"
          variant="white"
          onClick={() => setOpen(false)}
          style={{ width: "100%", minHeight: "40px" }}
          styleLabel={{ fontSize: "14px", fontWeight: "500" }}
        />
        <Button
          label={editData ? "Сохранить изменения" : "Добавить чек"}
          variant="purple"
          onClick={handleSubmit}
          style={{ width: "100%", minHeight: "40px" }}
          styleLabel={{ fontSize: "14px", fontWeight: "500" }}
        />
      </div>
    </Modal>
  )
}

export default AddCheckModal 