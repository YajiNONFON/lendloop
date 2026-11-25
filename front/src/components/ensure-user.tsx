'use client';
import {useEffect} from 'react';
import {useConvexAuth,useMutation} from 'convex/react';
import {api} from '@convex/_generated/api';
// Creates the user profile in Convex right after sign-in (role is decided on the server).
export default function EnsureUser(){const{isAuthenticated}=useConvexAuth();const store=useMutation(api.users.mutations.store);
  useEffect(()=>{if(isAuthenticated)void store({});},[isAuthenticated,store]);return null;}
