import React from 'react';
import { Link } from 'react-router-dom';
import { RiDashboardLine } from 'react-icons/ri';
import { BiUser } from 'react-icons/bi';
import { FiSettings, FiLogOut, FiUser } from 'react-icons/fi';
import { AiOutlineFileDone } from 'react-icons/ai';
import { useAuth } from '../../hooks/auth';
import logo from '../../assets/logo.png';

import { Container, Aside, NavFooter } from './styles';

interface LayoutProps {
  selectedItem: string;
}

const Layout: React.FC<LayoutProps> = ({ selectedItem, ...rest }) => {
  const { signOut, user } = useAuth();

  return (
    <>
      <Aside>
        <ul>
          <li className={selectedItem === 'dashboard' ? 'selectedItem' : ''}>
            <Link to="/app/dashboard">
              <RiDashboardLine />
              <p>Dashboard</p>
            </Link>
          </li>

          {user.isadmin && (
            <>
              <li className={selectedItem === 'users' ? 'selectedItem' : ''}>
                <Link to="/app/users">
                  <BiUser />
                  <p>Usuários</p>
                </Link>
              </li>
              <li className={selectedItem === 'machines' ? 'selectedItem' : ''}>
                <Link to="/app/machines">
                  <FiSettings />
                  <p>Máquinas</p>
                </Link>
              </li>
            </>
          )}

          <li className={selectedItem === 'reports' ? 'selectedItem' : ''}>
            <Link to="/app/reports">
              <AiOutlineFileDone />
              <p>Relatórios</p>
            </Link>
          </li>

          <li onClick={() => signOut()}>
            <FiLogOut />
            <p>Sair</p>
          </li>

          <NavFooter>
            <p>{`${new Date().getFullYear()} - Soldage Equipamentos e Acessórios`}</p>
          </NavFooter>
        </ul>
        <footer />
      </Aside>
      <Container>
        <div className="appContent">
          <header>
            <img src={logo} alt="logo" className="logo" />
            <div className="headerUser">
              <p>{`Olá, ${user.name}`}</p>
              <div className="userAvatar">
                <FiUser />
              </div>
            </div>
          </header>
        </div>
      </Container>
    </>
  );
};

export default Layout;
