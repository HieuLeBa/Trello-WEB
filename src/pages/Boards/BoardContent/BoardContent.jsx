import { Box } from '@mui/material'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import {
  DndContext,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  closestCenter
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent( { board } ) {
  const pointerSensor = useSensor( PointerSensor, { activationConstraint: { distance: 10 } } )
  const mouseSensor = useSensor( MouseSensor, { activationConstraint: { distance: 10 } } )
  const touchSensor = useSensor( TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } } )
  // const sensors = useSensors( pointerSensor )
  const sensors = useSensors( mouseSensor, touchSensor )

  const [ orderedColumns, setOrderedColumns ] = useState( [] )
  const [ activeDragItemId, setActiveDragItemId ] = useState( null )
  const [ activeDragItemType, setActiveDragItemType ] = useState( null )
  const [ activeDragItemData, setActiveDragItemData ] = useState( null )
  const [ oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard ] = useState( null )

  const lastOverId = useRef( null )

  useEffect( () => {
    setOrderedColumns( mapOrder( board?.columns, board?.columnOrderIds, '_id' ) )
  }, [ board ] )

  const findColumnByCardId = ( cardId ) => {
    return orderedColumns.find( column => column?.cards?.map( card => card._id )?.includes( cardId ) )
  }

  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns( prevColumn => {
      const overCardIndex = overColumn?.cards?.findIndex( card => card._id === overCardId )

      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      const nextColumns = cloneDeep( prevColumn )
      const nextActiveColumn = nextColumns.find( column => column._id === activeColumn._id )
      const nextOverColumn = nextColumns.find( column => column._id === overColumn._id )

      if ( nextActiveColumn ) {
        nextActiveColumn.cards = nextActiveColumn.cards.filter( card => card._id !== activeDraggingCardId )

        if ( isEmpty( nextActiveColumn.cards ) ) {
          nextActiveColumn.cards = [ generatePlaceholderCard( nextActiveColumn ) ]
        }

        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map( card => card._id )
      }
      if ( nextOverColumn ) {
        nextOverColumn.cards = nextOverColumn.cards.filter( card => card._id !== activeDraggingCardId )
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        nextOverColumn.cards = nextOverColumn.cards.toSpliced( newCardIndex, 0, rebuild_activeDraggingCardData )

        nextOverColumn.cards = nextOverColumn.cards.filter( card => !card.FE_PlaceholderCard )

        nextOverColumn.cardOrderIds = nextOverColumn.cards.map( card => card._id )
      }
      return nextColumns
    } )
  }

  const handleDragStart = ( event ) => {
    console.log( 'handleDragStart', event )
    setActiveDragItemId( event?.active?.id )
    setActiveDragItemType( event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN )
    setActiveDragItemData( event?.active?.data?.current )
    if ( event?.active?.data?.current?.columnId ) {
      setOldColumnWhenDraggingCard( findColumnByCardId( event?.active?.id ) )
    }
  }

  const handleDragOver = ( event ) => {
    const { active, over } = event
    console.log( 'handleDragOver', event )
    if ( activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN ) return
    if ( !active || !over ) return
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    const { id: overCardId } = over

    const activeColumn = findColumnByCardId( activeDraggingCardId )
    const overColumn = findColumnByCardId( overCardId )

    if ( !activeColumn || !overColumn ) return

    if ( activeColumn._id !== overColumn._id ) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  const handleDragEnd = ( event ) => {
    const { active, over } = event
    if ( !over || !active ) return

    if ( activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD ) {

      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      const { id: overCardId } = over

      const activeColumn = findColumnByCardId( activeDraggingCardId )
      const overColumn = findColumnByCardId( overCardId )

      if ( !activeColumn || !overColumn ) return
      if ( oldColumnWhenDraggingCard._id !== overColumn._id ) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex( c => c._id === activeDragItemId )
        const newCardIndex = overColumn?.cards?.findIndex( c => c._id === overCardId )
        const dndOrderedCards = arrayMove( oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex )
        setOrderedColumns( prevColumn => {
          const nextColumns = cloneDeep( prevColumn )

          const targetColumn = nextColumns.find( column => column._id === overColumn._id )
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map( card => card._id )

          return nextColumns
        } )
      }
    }

    if ( activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN ) {
      if ( active.id !== over.id ) {
        const oldColumnIndex = orderedColumns.findIndex( c => c._id === active.id )
        const newColuumnIndex = orderedColumns.findIndex( c => c._id === over.id )

        const dndOrderedColumns = arrayMove( orderedColumns, oldColumnIndex, newColuumnIndex )
        // const dndOrderedColumnsIds = dndOrderedColumns.map( c => c._id )
        setOrderedColumns( dndOrderedColumns )
      }
    }


    setActiveDragItemId( null )
    setActiveDragItemType( null )
    setActiveDragItemData( null )
    oldColumnWhenDraggingCard( null )
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects( {
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    } )
  }

  const collisionDetectionStrategy = useCallback( ( args ) => {
    if ( activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN ) {
      return closestCorners( { ...args } )
    }
    const pointerIntersections = pointerWithin( args )

    if ( !pointerIntersections?.length ) return

    // const intersections = pointerIntersections.length > 0 ? pointerIntersections : rectIntersection( args )
    let overId = getFirstCollision( pointerIntersections, 'id' )
    if ( overId ) {
      const checkColumn = orderedColumns.find( column => column._id === overId )
      if ( checkColumn ) {
        overId = closestCenter( {
          ...args,
          droppableContainers: args.droppableContainers.filter( container => {
            return container.id !== overId && checkColumn?.cardOrderIds?.includes( container.id )
          } )[ 0 ]?.id
        } )
      }
      lastOverId.current = overId
      return [ { id: overId } ]
    }
    return lastOverId.current ? [ { id: lastOverId.current } ] : []
  }, [ activeDragItemType ] )

  return (
    <DndContext
      sensors={ sensors }
      // collisionDetection={ closestCorners }
      collisionDetection={ collisionDetectionStrategy }
      onDragStart={ handleDragStart }
      onDragOver={ handleDragOver }
      onDragEnd={ handleDragEnd }
    >
      <Box sx={ {
        bgcolor: ( theme ) => ( theme.palette.mode === 'dark' ? '#34495e' : '#1976d2' ),
        width: '100%',
        height: ( theme ) => theme.trello.boardContentHeight,
        p: '10px 0'
      } }>
        <ListColumns columns={ orderedColumns } />
        <DragOverlay dropAnimation={ dropAnimation }>
          { ( !activeDragItemType ) && null }
          { ( activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN ) && <Column column={ activeDragItemData } /> }
          { ( activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD ) && <Card card={ activeDragItemData } /> }
        </DragOverlay>
      </Box >
    </DndContext>
  )
}

export default BoardContent