import { useState, useEffect } from "react";
import styles from "./client-checks-table.module.scss";
import { Calendar, TableIcon, CardIcon, EditSvg as EditIcon, Trash as Cross, Plus } from '../../svgs/svgs';
import ChecksInfo from '../../checks-info/checks-info';

interface CheckRow {
    id: string;
    date: string;
    product: string;
    unit: string;
    quantity: string;
    priceWithVAT: string;
    totalWithVAT: string;
    vat20: string;
}

interface ClientChecksTableProps {
    data: CheckRow[];
    onDelete?: (id: string) => void;
    onEdit?: (id: string) => void;
    onAddCheck?: () => void;
    showAddButton?: boolean;
    onViewModeChange?: (mode: 'table' | 'cards') => void;
    hideTitle?: boolean;
    hideChecksInfo?: boolean;
    isApplicationMode?: boolean;
}

const ClientChecksTable: React.FC<ClientChecksTableProps> = ({
    data = [],
    onDelete,
    onEdit,
    onAddCheck,
    showAddButton = true,
    onViewModeChange,
    hideTitle = false,
    hideChecksInfo = false,
    isApplicationMode = false
}) => {
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
    const [isMobile, setIsMobile] = useState(false);
    // console.log(data, 'data')
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 600;
            setIsMobile(mobile);
            setViewMode(mobile ? 'cards' : 'table');
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        onViewModeChange?.(viewMode);
    }, [viewMode, onViewModeChange]);

    const renderCard = (row: CheckRow, index: number) => {
        const rowValues = calculateRowValues(row);
        return (
            <div className={styles.card} key={row.id}>
                <div className={styles.cardHeader}>
                    <div className={styles.cardHeaderLeft}>
                        <span className={styles.cardLabel}>Чек №</span>
                        <span className={styles.cardValue}>{index + 1}</span>
                    </div>
                    <div className={styles.cardHeaderRight}>
                        <span className={styles.cardLabel}>Дата:</span>
                        <span className={styles.cardValue}>{row.date}</span>
                    </div>
                </div>
                <div className={styles.cardBody}>
                    <div className={styles.SellerBuyer}>
                        <div className={styles.cardSection}>
                            <div className={styles.cardRow}>
                                <span className={styles.cardLabel}>Товар:</span>
                                <span className={styles.cardValue}>{row.product}</span>
                            </div>
                            <div className={styles.cardRow}>
                                <span className={styles.cardLabel}>Ед.изм:</span>
                                <span className={styles.cardValue}>{row.unit}</span>
                            </div>
                            <div className={styles.cardRow}>
                                <span className={styles.cardLabel}>Кол-во:</span>
                                <span className={styles.cardValue}>{row.quantity}</span>
                            </div>
                            <div className={styles.cardRow}>
                                <span className={styles.cardLabel}>Цена за ед. с НДС:</span>
                                <span className={styles.cardValue}>{row.priceWithVAT}</span>
                            </div>
                            <div className={styles.cardRow}>
                                <span className={styles.cardLabel}>Стоимость с НДС:</span>
                                <span className={styles.cardValue}>{`${rowValues.total} ₽`}</span>
                            </div>
                            <div className={styles.cardRow}>
                                <span className={styles.cardLabel}>НДС 20%:</span>
                                <span className={styles.cardValue}>{`${rowValues.vat} ₽`}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {(onEdit || onDelete) && (
                    <div className={styles.cardActions}>
                        {onEdit && (
                            <button onClick={() => onEdit(row.id)} className={styles.editButton}>
                                <EditIcon />
                            </button>
                        )}
                        {onDelete && (
                            <button onClick={() => onDelete(row.id)} className={styles.deleteButton}>
                                <Cross />
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const calculateTotals = () => {
        return data.reduce((acc, row) => {
            const cleanNumber = (str: string) => {
                return parseFloat(str.replace(/[₽\s]/g, '').replace(',', '.')) || 0;
            };

            // Получаем базовые значения
            const quantity = cleanNumber(row.quantity);
            const pricePerUnit = cleanNumber(row.priceWithVAT);
            
            // Рассчитываем итоговые значения
            const total = quantity * pricePerUnit;
            const vat = total * 0.2; // 20% от суммы

            // console.log({
            //     quantity,
            //     pricePerUnit,
            //     calculatedTotal: total,
            //     calculatedVat: vat,
            //     rowTotal: row.totalWithVAT,
            //     rowVat: row.vat20
            // });

            // Используем рассчитанные значения для итогов
            return {
                total: acc.total + total,
                vat: acc.vat + vat
            };
        }, { total: 0, vat: 0 });
    };

    const formatNumber = (num: number): string => {
        return new Intl.NumberFormat('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            useGrouping: true
        }).format(num);
    };

    const totals = calculateTotals();
    const hasCardsForMobile = isMobile && viewMode === 'cards' && data.length > 0;

    // Функция для расчета значений строки
    const calculateRowValues = (row: CheckRow) => {
        const cleanNumber = (str: string) => {
            return parseFloat(str.replace(/[₽\s]/g, '').replace(',', '.')) || 0;
        };

        const quantity = cleanNumber(row.quantity);
        const pricePerUnit = cleanNumber(row.priceWithVAT);
        const total = quantity * pricePerUnit;
        const vat = total * 0.2;

        return {
            total: formatNumber(total),
            vat: formatNumber(vat)
        };
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                {!hideTitle && (
                    <div className={styles.titleBlock}>
                        <h1>Чеки</h1>
                        {isMobile && (
                            <div className={styles.viewToggle}>
                                <button
                                    className={`${styles.toggleButton} ${viewMode === 'table' ? styles.active : ''}`}
                                    onClick={() => setViewMode('table')}
                                >
                                    <TableIcon />
                                </button>
                                <button
                                    className={`${styles.toggleButton} ${viewMode === 'cards' ? styles.active : ''}`}
                                    onClick={() => setViewMode('cards')}
                                >
                                    <CardIcon />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {hasCardsForMobile && !hideChecksInfo && (
                <div className={styles.checksInfoWrapper}>
                    <ChecksInfo
                        dates={`${data[0]?.date} → ${data[data.length - 1]?.date}`}
                        checksCount={data.length}
                        sumWithVat={formatNumber(totals.total)}
                        vat={formatNumber(totals.vat)}
                        onAddCheck={onAddCheck}
                        isApplicationMode={isApplicationMode}
                    />
                </div>
            )}

            <div className={styles.container}>
                {(!isMobile || viewMode === 'table') && (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>Дата</th>
                                <th>Товар</th>
                                <th>Ед.изм.</th>
                                <th>Кол-во</th>
                                <th>Цена за ед. с НДС</th>
                                <th>Стоимость с НДС</th>
                                <th>НДС 20%</th>
                                {(onDelete || onEdit) && <th>Действия</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => {
                                const rowValues = calculateRowValues(row);
                                return (
                                    <tr key={row.id}>
                                        <td>№{index + 1}</td>
                                        <td>
                                            <div className={styles.dateContainer}>
                                                <Calendar />
                                                <span>{row.date}</span>
                                            </div>
                                        </td>
                                        <td>{row.product}</td>
                                        <td>{row.unit}</td>
                                        <td>{row.quantity}</td>
                                        <td>{row.priceWithVAT}</td>
                                        <td className={styles.vat}>{`${rowValues.total} ₽`}</td>
                                        <td className={styles.vat}>{`${rowValues.vat} ₽`}</td>
                                        {(onDelete || onEdit) && (
                                            <td className={styles.actions}>
                                                {onEdit && (
                                                    <button onClick={() => onEdit(row.id)} className={styles.editButton}>
                                                        <EditIcon />
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button onClick={() => onDelete(row.id)} className={styles.deleteButton}>
                                                        <Cross />
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr className={styles.totalRow}>
                                <td colSpan={6}>Итого:</td>
                                <td>{formatNumber(totals.total)}</td>
                                <td>{formatNumber(totals.vat)}</td>
                                {(onDelete || onEdit) && <td></td>}
                            </tr>
                        </tfoot>
                    </table>
                )}

                {(isMobile && viewMode === 'cards') && (
                    <div className={styles.cardsContainer}>
                        {data.map((row, index) => renderCard(row, index))}
                    </div>
                )}
            </div>

            {showAddButton && data.length > 0 && (
                <button 
                    className={`${styles.addCheckButton} ${isMobile ? styles.mobileButton : ''}`} 
                    onClick={onAddCheck}
                >
                    <Plus />
                    Добавить чек
                </button>
            )}
        </div>
    );
};

export default ClientChecksTable; 