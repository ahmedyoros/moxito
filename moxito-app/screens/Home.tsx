import React from 'react';
import useCurrentUser from '../backend/UserManager';
import Loading from '../components/Loading';
import { Role } from '../enums/Role';
import { UserStatus } from '../enums/Status';
import FollowDriver from './customer/FollowDriver';
import SearchDriver from './customer/SearchDriver';
import SearchMap from './customer/SearchMap';
import AcceptRace from './driver/AcceptRace';
import FollowRace from './driver/FollowRace';
import Idle from './driver/Idle';
import SearchRace from './driver/SearchRace';

export default function Home() {
  const [user, loading] = useCurrentUser();
  if (loading) return <Loading />;
  
  if (user.role === Role.Driver){
    switch (user.status) {
      default: //idle
        return <Idle />;
      case UserStatus.searching:
        return <SearchRace />;
      case UserStatus.accepting:
        return <AcceptRace user={user}/>;
      case UserStatus.racing:
        return <FollowRace user={user}/>;
    }
  }

  switch (user.status) {
    default: //idle
      return <SearchMap user={user} />;
    case UserStatus.searching:
      return <SearchDriver user={user}/>;
    case UserStatus.racing:
      return <FollowDriver user={user}/>;
  }
}
