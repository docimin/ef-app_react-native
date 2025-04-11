import React from 'react'
import { StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { appStyles } from '@/components/AppStyles'
import { ArtistAlleyContent } from '@/components/artistalley/ArtistAlleyContent'
import { Floater, padFloater } from '@/components/generic/containers/Floater'
import { Header } from '@/components/generic/containers/Header'
import { useUpdateSinceNote } from '@/hooks/data/useUpdateSinceNote'
import { useLatchTrue } from '@/hooks/util/useLatchTrue'
import { platformShareIcon } from '@/components/generic/atoms/Icon'
import { shareArtist } from '@/components/artistalley/ArtistAlley.common'
import { useCache } from '@/context/data/Cache'

export default function ArtistAlleyItem() {
  const { t } = useTranslation('ArtistAlley')
  const { id } = useLocalSearchParams<{ id: string }>()
  const { artistAlley } = useCache()
  const artist = artistAlley.dict[id]

  // Get update note. Latch so it's displayed even if reset in background.
  const updated = useUpdateSinceNote(artist)
  const showUpdated = useLatchTrue(updated)

  return (
    <ScrollView style={StyleSheet.absoluteFill} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
      <Header secondaryIcon={platformShareIcon} secondaryPress={() => artist && shareArtist(artist)}>
        {artist?.DisplayNameOrAttendeeNickname ?? t('viewing_artist')}
      </Header>
      <Floater contentStyle={appStyles.trailer}>{!artist ? null : <ArtistAlleyContent artist={artist} parentPad={padFloater} updated={showUpdated} />}</Floater>
    </ScrollView>
  )
}
