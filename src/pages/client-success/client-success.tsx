import { Plus } from '../../components/svgs/svgs';
import Button from '../../components/ui/button/button';
import s from './client-success.module.scss';
import logout from '../../assets/logout.png'
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import { logout as logoutAction } from '../../store/slices/clientSlice';

export const ClientSuccess = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const handleLogout = () => {
        dispatch(logoutAction());
        navigate('/');
    }
    return <div className={s.clientSuccess}>
        <div className={s.clientSuccess__container}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={50}
                height={50}
                viewBox="0 0 50 50"
                fill="none"
            >
                <path
                    d="M25 45.8332C13.4938 45.8332 4.16669 36.5061 4.16669 24.9998C4.16669 13.4936 13.4938 4.1665 25 4.1665C36.5063 4.1665 45.8334 13.4936 45.8334 24.9998C45.8334 36.5061 36.5063 45.8332 25 45.8332ZM22.9229 33.3332L37.6521 18.6019L34.7063 15.6561L22.9229 27.4415L17.0292 21.5478L14.0834 24.4936L22.9229 33.3332Z"
                    fill="#26BD6C"
                />
            </svg>
            <h1>Заявка успешно отправлена</h1>
            <div className={s.buttons}>
                <Button onClick={() => navigate('/client/main')} icon={<Plus />} label='Создать заявку' variant='purple' style={{width: '190px', height: '40px'}} styleLabel={{fontSize: '14px', fontWeight: '500'}}/>
                <Button onClick={handleLogout} icon={<img src={logout} alt='logout' />} label='Выход' variant='white' style={{width: '190px', height: '40px'}} styleLabel={{fontSize: '14px', fontWeight: '500'}}/>

            </div>
        </div>

    </div>;
};
