// hooks / useAsyncOperation.ts

// What does this hook do?
//  1. Provides an execute function that takes any asynchronous function, sets loading to true, clears previous errors, 
//     then runs the function inside a try/catch block. If an error occurs, it stores the error and rethrows it; otherwise, 
//     it returns the result.
//  2. Maintains two state variables: one for a loading flag and one for storing any error.

// Why are we using this?
//  -  By encapsulating this behavior, we don’t need to manually manage loading and 
//     error states in each component that makes async calls.

import { useState } from 'react';

export function useAsyncOperation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = async <T>(asyncFunc: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFunc();
      return result;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
}
