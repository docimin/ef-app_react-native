import { useAuthContext } from '@/context/auth/Auth'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '@/context/query/Query'
import axios, { GenericAbortSignal } from 'axios'
import { apiBase } from '@/configuration'

/**
 * Deletes own table registration, checking out.
 * @param accessToken The access token.
 * @param signal An abort signal.
 */
export async function deleteArtistsAlleyOwnRegistration(accessToken: string | null, signal?: GenericAbortSignal) {
  if (!accessToken) throw new Error('Unauthorized')
  return await axios.delete(`${apiBase}/ArtistsAlley/TableRegistration/:my-latest`, {
    signal: signal,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })
}

/**
 * Uses a mutation for `deleteArtistsAlleyOwnRegistration` with the app auth state.
 */
export function useArtistsAlleyCheckOutMutation() {
  const { accessToken, claims } = useAuthContext()
  return useMutation({
    mutationFn: () => deleteArtistsAlleyOwnRegistration(accessToken),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [claims?.sub, 'artists-alley'] }),
  })
}
