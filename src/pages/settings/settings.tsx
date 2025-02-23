import React from 'react'
import s from './settings.module.scss'
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import logout from '../../assets/logout.png'
import { BuildingsIcon, KeyIcon } from '../../components/svgs/svgs';
import MobileHeader from '../../components/mobile-header/mobile-header';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout as logoutAction } from '../../store/slices/adminSlice';

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const admin = useAppSelector(state => state.admin.currentAdmin);
  const activeTab = location.pathname.includes('access') ? 'access' : location.pathname.includes('sellers') ? 'sellers' : '';
  console.log(admin)
  return (
    <div className={s.settings}>
      <div className={s.desktop}>
        <h1 className={s.title}>Настройки</h1>
        <div className={s.tabs}>
          <button
            className={`${s.tab} ${activeTab === 'sellers' ? s.active : ''}`}
            onClick={() => navigate('/admin/settings/sellers')}
          >
            Продавцы
          </button>
          <button
            className={`${s.tab} ${activeTab === 'access' ? s.active : ''}`}
            onClick={() => navigate('/admin/settings/access')}
          >
            Доступы
          </button>
        </div>
      </div>
      {activeTab === "" && <div className={s.mobile}>
        <MobileHeader title={'Настройки'}/>
        <div className={s.mobile_content}>
          <div className={s.account}>
            <div className={s.left}>
              <div className={s.account_info}>В</div>
              <div className={s.titles}>
                <h2>{admin?.name}</h2>
                <p>Администратор</p>
              </div>
            </div>
            <div onClick={() => dispatch(logoutAction())} className={s.logout}><img src={logout} alt="/" /></div>
          </div>
          <div className={s.hr}></div>
          <div onClick={() => navigate('/admin/settings/sellers')} className={s.link}>
              <BuildingsIcon />
              <h3>Продавцы</h3>
          </div>
          <div onClick={() => navigate('/admin/settings/access')} className={s.link}>
              <KeyIcon />
              <h3>Доступы</h3>
          </div>
        </div>
      </div>}

      <div className={s.outlet}><Outlet /></div>
      {activeTab !== "" && <div className={s.responsive_outlet}><Outlet /></div>}
    </div>
  )
}

export default Settings
