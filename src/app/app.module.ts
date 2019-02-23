// Components, functions, plugins
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ErrorHandler, Injectable, Injector, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { HTTP } from '@ionic-native/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite } from '@ionic-native/sqlite';
import { MyApp } from './app.component';
import { OneSignal } from '@ionic-native/onesignal';
//import { GoogleMaps } from '@ionic-native/google-maps';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { Camera } from '@ionic-native/camera';
import { IonTextAvatar } from 'ionic-text-avatar';
import { IonicImageLoader } from 'ionic-image-loader';
import { ChartsModule } from 'ng2-charts';
import { FileUploadModule } from 'ng2-file-upload';
//import { IonAlphaScrollModule } from 'ionic2-alpha-scroll';
import { Keyboard } from '@ionic-native/keyboard';
//import { ProgressBarComponent } from '../components/progress-bar/progress-bar';

// Providers
import { Database } from '../providers/database/database';
import { Localstorage } from '../providers/localstorage/localstorage';
import { Synchronization } from '../providers/synchronization/synchronization';
import { RelativeTime } from '../pipes/relative-time';

// Services
import { PostService } from '../services/post-service';
import { UserService } from '../services/user-service';
//import { NotificationService } from '../services/notification-service';
import { ChatService } from '../services/chat-service';

// Pages
import { HomePage } from '../pages/home/home';
import { ConferenceCityPage } from '../pages/conferencecity/conferencecity';
import { SocialPage } from '../pages/social/social';
import { MorePage } from '../pages/more/more';

import { SliderPage } from '../pages/slider/slider';
import { HelpPage } from '../pages/help/help';
import { SpeakersPage } from '../pages/speakers/speakers';
import { ProgramPage } from '../pages/program/program';
import { MapPage } from '../pages/map/map';
import { LoginPage } from '../pages/login/login';
import { ExhibitorsPage } from '../pages/exhibitors/exhibitors';
import { NotesPage } from '../pages/notes/notes';
import { DatabasePage } from '../pages/database/database';
import { EvaluationConference } from '../pages/evaluationconference/evaluationconference';
import { MyAgenda } from '../pages/myagenda/myagenda';
import { MyAgendaFull } from '../pages/myagendafull/myagendafull';
import { EducationDetailsPage } from '../pages/educationdetails/educationdetails';
import { ActivityPage } from '../pages/activity/activity';
import { ProfilePage } from '../pages/profile/profile';
import { ConversationsPage } from '../pages/conversations/conversations';
import { NotificationsPage } from '../pages/notifications/notifications';
import { AttendeesPage } from '../pages/attendees/attendees';
import { NetworkingPage } from '../pages/networking/networking';
import { AttendeeBookmarksPage } from '../pages/attendeebookmarks/attendeebookmarks';
import { ConversationPage } from '../pages/conversation/conversation';

// Temporary Support Pages
//import { FloorplanMappingPage } from '../pages/floorplanmapping/floorplanmapping';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SocialPage,
    MorePage,
    SliderPage,
    HelpPage,
    SpeakersPage,
    ProgramPage,
    MapPage,
    LoginPage,
    ConferenceCityPage,
    ExhibitorsPage,
    NotesPage,
    DatabasePage,
	EducationDetailsPage,
	EvaluationConference,
	//FloorplanMappingPage,
	MyAgenda,
	MyAgendaFull,
    ConversationPage,
    NotificationsPage,
    AttendeesPage,
    AttendeeBookmarksPage,
	NetworkingPage,
	RelativeTime,
	IonTextAvatar,
    ProfilePage,
    //ProgressBarComponent,
	ActivityPage
  ],

  imports: [
  BrowserModule,
    FormsModule,
    HttpModule,
	ChartsModule,
	FileUploadModule,
    IonicImageViewerModule,
    //IonAlphaScrollModule,
    HttpClientModule,
	IonicStorageModule.forRoot(),
	IonicImageLoader.forRoot(),
	IonicModule.forRoot(MyApp,{tabsPlacement: 'bottom'})
	],

  bootstrap: [IonicApp],

  entryComponents: [
    MyApp,
    HomePage,
    SliderPage,
    SocialPage,
    MorePage,
    HelpPage,
    SpeakersPage,
    ProgramPage,
    MapPage,
    LoginPage,
    ConferenceCityPage,
    DatabasePage,
	EducationDetailsPage,
    ExhibitorsPage,
    NotesPage,
	EvaluationConference,
	//FloorplanMappingPage,
	MyAgenda,
	MyAgendaFull,
    ConversationPage,
    NotificationsPage,
    AttendeesPage,
    AttendeeBookmarksPage,
	NetworkingPage,
	ProfilePage,
	ActivityPage
  ],

  providers: [
	Camera,
    StatusBar,
	OneSignal,
	HTTP,
    Keyboard,
	Localstorage,
	SplashScreen,
		{provide: ErrorHandler, useClass: IonicErrorHandler},
	//[{ provide: ErrorHandler, useClass: MyErrorHandler }],
	Database,
	SQLite,
	PostService,
	UserService,
	ChatService,
	Synchronization
  ]
  })

  export class AppModule {}


