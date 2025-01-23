import React, { FC, useState } from "react";
import {
  BackArrow,
  Calendar,
  DetailedAvatar,
  ChangeStatus,
  EditSvg,
  Tick,
  ArrowLeft,
  TopArrow,
  ClientIcon,
  UserIcon
} from "../../svgs/svgs";

import { ApplicationStatus } from "../../../constants/statuses";
import StatusBadge from "../status-badge/status-badge";
import Button from "../button/button";
import ChangingStatus from "../../changing-status/changing-status";
import CancelApplication from "../../modals/cancel-application/cancel-application";
import s from "./page-title.module.scss";
import IsEditingBar from "../../is-editing-bar/is-editing-bar";
import ChooseStatus from "../../modals/choose-status/chose-status";
import { useNavigate } from "react-router-dom";

interface PageTitleProps {
  title: string;
  hideBtns?: boolean;
  isCompany?: boolean;
  statuses?: ApplicationStatus[];
  setStatuses?: (statuses: ApplicationStatus[]) => void;
  name?: string;
  editing?: boolean;
  setEditing?: (editing: boolean) => void;
  onSave?: () => void;
  onCancel?: () => void;
  date?: string;
  responsive_name?: string;
  marginTopZero?: boolean;
  clientId?: string;
  id?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({
  date,
  title,
  statuses = [],
  name,
  marginTopZero,
  noRightBtns,
  hideBtns,
  setStatuses,
  isCompany = false,
  isUser = false,
  handleUpdateUser,
  clientId,
  editing = false,
  userDeskr,
  setEditing,
  responsive_name,
  id,
  responsive_btns = false,
  setOpen,
  onSave,
  onCancel
}) => {
  const [statusesOpened, setStatusesOpened] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [chooseStatusOpened, setChooseStatusOpened] = useState(false);
  const isMobile = window.innerWidth < 1000;

  const handleSave = () => {
    onSave?.();
  };
  const navigate = useNavigate();
  const handleEdit = () => {
    if (isUser) {
      return setOpen && setOpen();
    }
    setEditing?.(true);
  };

  const handleCancel = () => {
    onCancel?.();
  };

  const handleStatusChange = () => {
    if (isMobile) {
      setChooseStatusOpened(true);
    } else {
      setStatusesOpened(prev => !prev);
    }
  };

  const handleDateClick = () => {
    if (date) {
      // Преобразуем дату из формата DD/MM/YYYY в YYYY-MM-DD
      const [day, month, year] = date.split('/');
      const formattedDate = `${year}-${month}-${day}`;
      navigate(`/admin/applications?date=${encodeURIComponent(formattedDate)}`);
    }
  };

  const renderStatusBadges = () => {
    if (!statuses.length) return null;

    return (
      <div onClick={() => setChooseStatusOpened(true)} className={s.statuses}>
        {statuses.map((status) => (
          <StatusBadge key={status} status={status} big={true} />
        ))}
      </div>
    );
  };

  const renderRightButtons = () => {
    if (noRightBtns) return null;

    return (
      <div className={s.rightBtns}>
        <div className={s.statusesBtnDiv}>
          {!isUser && (
            editing ? (
              <Button
                onClick={handleCancel}
                variant="white"
                icon={<ChangeStatus />}
                label="Отмена"
                style={{ height: "32px", width: "200px" }}
                styleLabel={{ fontSize: "14px" }}
              />
            ) : (
              <>
                <Button
                  onClick={handleStatusChange}
                  variant="white"
                  icon={<ChangeStatus />}
                  label="Изменить статус"
                  style={{ height: "32px", width: "162px" }}
                  styleLabel={{ fontSize: "14px" }}
                />
                {statuses && setStatuses && (
                  <ChangingStatus
                    statuses={statuses}
                    id={id}
                    setStatuses={setStatuses}
                    isOpened={statusesOpened}
                    setOpened={handleStatusChange}
                  />
                )}
              </>
            )
          )}
        </div>

        {!isUser && (
          editing ? (
            <Button
              variant="purple"
              icon={<Tick />}
              onClick={handleSave}
              label="Сохранить изменения"
              style={{ height: "32px", width: "200px" }}
              styleLabel={{ fontSize: "14px" }}
            />
          ) : (
            <Button
              variant="white"
              onClick={handleEdit}
              icon={<EditSvg />}
              label="Редактировать"
              style={{ height: "32px", width: "150px" }}
              styleLabel={{ fontSize: "14px" }}
            />
          )
        )}

        {isUser && !isCompany && 
          <Button
            variant="white"
            onClick={() => setOpen && setOpen()}
            icon={<EditSvg />}
            label="Редактировать клиента"
            style={{ height: "32px", width: "210px" }}
            styleLabel={{ fontSize: "14px" }}
          />
        }
      </div>
    );
  };

  return (
    <>
      {!isUser && <CancelApplication
        isOpened={canceling}
        setOpen={setCanceling}
        setEditing={() => setEditing?.(false)}
      />}
      {statuses && <ChooseStatus
        statuses={statuses}
        setStatuses={setStatuses}
        isOpened={chooseStatusOpened}
        setOpen={setChooseStatusOpened}
      />}
      <div className={s.responsiveHeader}>
        <div className={s.backBtn}>
          {editing ? <span onClick={handleCancel}>Отмена</span> : <><TopArrow />
            <span onClick={() => navigate(-1)}>Назад</span></>}
        </div>
        <h2>{responsive_name}</h2>
        {responsive_btns ? responsive_btns.map((btn) => <button className={s.editBtn} onClick={btn.onClick}>{btn.text}</button>) : editing ? (
          <button onClick={handleSave} className={s.editBtn}>Сохранить</button>
        ) : (
          !hideBtns ? <button onClick={handleEdit} className={s.editBtn}>Изменить</button> : <div style={{width: '60px'}}></div>
        )}
      </div>
      <div style={{marginTop: marginTopZero ? '0' : ''}} className={s.pageTitle}>
        <IsEditingBar isEditing={editing} />

        <div className={s.globalLeft}>

          <div onClick={() => navigate(-1)} className={s.backArrow}>
            <BackArrow />
          </div>
          <div className={s.right}>
            <div className={`${s.top} ${isUser ? s.topUser : ''}`}>
              {isUser && !isCompany && <div className={s.userIconSvg}><UserIcon /></div>}
              <div className={s.titleDivUser}>
                {title && <h1 className={s.title}>{title}</h1>}
                {isUser ? <p>{userDeskr}</p> : isCompany ? <p style={{marginTop:'25px'}}>{companyDeskr}</p> : null}
              </div>
              {renderStatusBadges()}
            </div>
            <div className={s.bott}>
              {date && <div className={s.infoBlock} onClick={handleDateClick} style={{ cursor: 'pointer' }}>
                <div className={s.svg}>
                  <Calendar />
                </div>
                <p>{date}</p>
              </div>}

              {name && <div className={s.infoBlock}>
                 <div className={s.svg}>
                  <DetailedAvatar />
                </div>
                
                <p onClick={() => {
                  if (clientId) {
                    navigate(`/admin/detailed-client/${clientId}`);
                  }
                }}>{name}</p>
              </div>}
            </div>
          </div>
        </div>
        {renderRightButtons()}
      </div>
    </>
  );
};

export default PageTitle;
