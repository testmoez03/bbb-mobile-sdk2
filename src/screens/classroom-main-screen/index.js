import { SafeAreaView } from 'react-native';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { ActionsBarContext } from '../../store/context/actions-bar-context';
import BottomSheetChat from '../../components/chat/bottom-sheet-chat';
import { BottomSheetContext } from '../../store/context/bottom-sheet-context';
import { useOrientation } from '../../hooks/use-orientation';
import Colors from '../../constants/colors';
import Styled from './styles';

const ClassroomMainScreen = () => {
  // variables
  const slidesStore = useSelector((state) => state.slidesCollection);
  const presentationsStore = useSelector(
    (state) => state.presentationsCollection
  );
  const usersStore = useSelector((state) => state.usersCollection);
  const groupChatMsgStore = useSelector(
    (state) => state.groupChatMsgCollection
  );
  const orientation = useOrientation();
  const [switchLandscapeLayout, setSwitchLandscapeLayout] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const actionsBarCtx = useContext(ActionsBarContext);
  const bottomSheetCtx = useContext(BottomSheetContext);
  const { actionsBarStatus } = actionsBarCtx;
  const { bottomSheet } = bottomSheetCtx;

  // handle redux store methods
  const handleUsers = useCallback(
    () =>
      Object.values(usersStore.usersCollection).map((user) => {
        return {
          userName: user.name,
          videoSource: user.avatar,
          userColor: user.color,
          // ...other properties
        };
      }),
    [usersStore]
  );

  const handleMessages = useCallback(
    () =>
      Object.values(groupChatMsgStore.groupChatMsgCollection).map((message) => {
        // if is a poll result message
        if (message.id.toString().includes('PUBLIC_CHAT_POLL_RESULT')) {
          return {
            author: 'Enquete foi publicada',
            message:
              'Verifique a seção destinada a enquete para observar os resultados',
          };
        }
        return {
          author: message.sender,
          message: message.message,
          // ...other properties
        };
      }),
    [groupChatMsgStore]
  );

  const handleSlideAndPresentationActive = useCallback(() => {
    // TODO Review this collection after update the 2.6 code
    const currentPresentation = Object.values(
      presentationsStore.presentationsCollection
    ).filter((obj) => {
      return obj.current === true;
    });

    const currentSlideList = Object.values(slidesStore.slidesCollection).filter(
      (obj) => {
        return (
          obj.current === true &&
          obj.presentationId === currentPresentation[0]?.id
        );
      }
    );
    const imageUri = currentSlideList[0]?.imageUri;
    return imageUri?.replace('/svg/', '/png/');
  }, [presentationsStore, slidesStore]);

  // lifecycle methods
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  // view components
  const renderPortraitOrientation = () => {
    return (
      <SafeAreaView>
        <Styled.ContainerView>
          <Styled.VideoListContainer>
            <Styled.VideoList videoUsers={handleUsers()} />
          </Styled.VideoListContainer>

          <Styled.PresentationContainer>
            <Styled.Presentation
              width="100%"
              height="100%"
              source={{
                uri: handleSlideAndPresentationActive(),
              }}
            />
          </Styled.PresentationContainer>

          <Styled.ChatContainer>
            {actionsBarStatus.isChatActive && (
              <Styled.Chat
                messages={handleMessages()}
                onPressItem={() =>
                  bottomSheetCtx.triggerButton('chatBottomSheet', true)
                }
              />
            )}
          </Styled.ChatContainer>

          <Styled.ActionsBarContainer>
            <Styled.ActionsBar />
          </Styled.ActionsBarContainer>
        </Styled.ContainerView>
        {bottomSheet.chatBottomSheet && (
          <BottomSheetChat messages={handleMessages()} />
        )}
      </SafeAreaView>
    );
  };

  const renderLandscapeOrientation = () => {
    return (
      <SafeAreaView>
        <Styled.ContainerView orientation={orientation}>
          <Styled.PresentationContainer orientation={orientation}>
            {actionsBarStatus.isChatActive && (
              <Styled.Chat
                messages={handleMessages()}
                onPressItem={() =>
                  bottomSheetCtx.triggerButton('chatBottomSheet', true)
                }
              />
            )}
            {!actionsBarStatus.isChatActive && (
              <>
                {switchLandscapeLayout && (
                  <Styled.Presentation
                    width="100%"
                    height="100%"
                    source={{ uri: handleSlideAndPresentationActive() }}
                  />
                )}
                {!switchLandscapeLayout && (
                  <Styled.VideoListContainer orientation={orientation}>
                    <Styled.VideoList
                      videoUsers={handleUsers()}
                      orientation={orientation}
                    />
                  </Styled.VideoListContainer>
                )}
                <Styled.SwitchLayoutButton
                  icon="animation-play-outline"
                  iconColor={Colors.lightGray300}
                  containerColor={Colors.lightGray100}
                  animated
                  onPress={() =>
                    setSwitchLandscapeLayout((prevState) => !prevState)
                  }
                />
              </>
            )}
          </Styled.PresentationContainer>
          <Styled.ActionsBarContainer orientation={orientation}>
            <Styled.ActionsBar orientation={orientation} />
          </Styled.ActionsBarContainer>
        </Styled.ContainerView>
        {bottomSheet.chatBottomSheet && (
          <BottomSheetChat messages={handleMessages()} />
        )}
      </SafeAreaView>
    );
  };

  // return
  if (isLoading) return Styled.renderSkeletonLoading();
  if (orientation === 'PORTRAIT') return renderPortraitOrientation();
  return renderLandscapeOrientation();
};

export default ClassroomMainScreen;
