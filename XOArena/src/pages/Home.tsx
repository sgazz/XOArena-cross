import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import TicTacToe from '../components/TicTacToe';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>XOArena</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">XOArena</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
          <TicTacToe />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
