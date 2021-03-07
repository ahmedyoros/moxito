import React from 'react';
import Loading from '../components/Loading';
import { Role } from '../enums/Role';
import useCurrentUser from '../backend/UserManager';
import HomeDriver from './HomeDriver';
import HomeUser from './HomeUser';

export default function Home() {
  const [user, loading] = useCurrentUser();

  if(loading) return <Loading />;
  return user.role === Role.Driver ? <HomeDriver user={user} /> : <HomeUser user={user}/>
}
