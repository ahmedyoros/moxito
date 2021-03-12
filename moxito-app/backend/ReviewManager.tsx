import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import {
  useCollectionData,
  useCollectionDataOnce,
  useDocumentData,
  useDocumentDataOnce,
  useDocumentOnce,
} from 'react-firebase-hooks/firestore';
import { firebaseConfig } from '../config';
import { Review } from '../types/Review';
import { BaseUser, User } from '../types/User';
import { getBaseUser } from './UserManager';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const getReviewRef = (userId: string) => {
  return firebase
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('reviews');
};

export const getAvgRating = (userId: string): [number, number[], boolean] => {
  const [reviews, loading] = useCollectionDataOnce<Review>(getReviewRef(userId));
  if(loading || reviews!.length === 0) return [0, [], loading];
  let length = reviews![0].ratings.length;
  let sumRating = new Array<number>(length).fill(0);
  let occRating = new Array<number>(length).fill(0);
  for(const review of reviews!){
    const rating = review.ratings;
    for(let i = 0; i < rating.length; i++){
      const vote = rating[i]
      if(vote){
        sumRating[i] += vote;
        occRating[i]++;
      }
    }
  }
  const avgRating = sumRating.map((r, i) => {
    const divider = occRating[i] === 0 ? 1 : occRating[i];
    return r/divider;
  });
  return [reviews!.length, avgRating, loading]
};

export const getReviewFrom = (raceId: string, reviewedId: string): [Review, boolean] => {
  const [review, loading] = useDocumentDataOnce<Review>(getReviewRef(reviewedId).doc(raceId));
  return [review!, loading];
};

export const setReview = (
  raceId: string,
  reviewedId: string,
  ratings: (number | null)[],
  callback?: () => void
) => {
  const review: Review = {
    ratings,
    reviewer: getBaseUser(),
  };
  getReviewRef(reviewedId)
    .doc(raceId)
    .set(review)
    .then(() => callback && callback());
};
