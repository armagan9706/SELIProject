import React from 'react';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Link } from 'react-router-dom';
import { Courses } from '../../lib/CourseCollection';

import MainMenu from '../components/navigation/MainMenu';
import AppBar from '../components/navigation/AppBar';

import Presentation from '../components/navigation/Presentation';
import PublishedCoursesList from '../components/tutor/PublishedCoursesList';
import SavedCoursesList from '../components/tutor/SavedCoursesList';
import CreateCourse from '../components/tutor/CreateCourse';
import ControlSnackbar from '../components/tools/ControlSnackbar';
import LoadingSnackbar from '../components/tools/LoadingSnackbar';
import AccountManagement from '../components/user/AccountManagement';
import Help from '../components/user/Help';
import Loading from '../components/tools/Loading';
import StorytellingTool from '../components/storytelling/StorytellingTool';
import StorytellingToolTime from '../components/storytelling/StorytellingToolTime';
import Stories from '../components/storytelling/Stories';
import CoursesDashboard from '../components/student/CoursesDashboard';
import SubscribedCourses from '../components/student/SubscribedCourses';
import Course from '../components/student/Course';
import MyCertificates from '../components/student/MyCertificates';
import DashboardComponent from '../components/dashboard/dashboard';

import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '../style/theme';
import WarningIcon from '@material-ui/icons/Warning';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import { checkUserType } from '../../lib/userSesions';
import { StudentLog } from '../../lib/StudentLogCollection';

import english from '../../lib/translation/english';
import spanish from '../../lib/translation/spanish';
import portuguese from '../../lib/translation/portuguese';
import polish from '../../lib/translation/polish';
import turkish from '../../lib/translation/turkish';

export default class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      component: 'home',
      nextComponent: '',
      savedCourse: false,
      savedCourseWindow: false,
      accountType: '',
      selected: [-1, -1],
      chekingSesion: true,
    }
  }

  componentDidMount(){
    Session.set({language: Session.get('language') ? Session.get('language') : english});
    this.setState({
      language: Session.get('language') ? Session.get('language') : english,
    });
    if (this.props.history.location.user) {
      this.setInitVariables(this.props.history.location.user);
    } else {
      Meteor.call("GetUserById", Meteor.userId(), (error, response) =>  {
        this.setInitVariables(response);
      });
    }
  }

  setInitVariables = (response) => {
    let language = {};
    if (response.profile.configuration.language === 'us') {
      language = english;
    }
    else if (response.profile.configuration.language === 'pt') {
      language = portuguese;
    } 
    else if (response.profile.configuration.language === 'es') {
      language = spanish;
    }
    else if (response.profile.configuration.language === 'pl') {
      language = polish;
    }
    else if (response.profile.configuration.language === 'tr') {
      language = turkish;
    }
    this.setState({
      language: language,
      user: response,
      chekingSesion: false,
    }, () => {
      checkUserType(response, this.state.user.profile.type, this.props.history);
      this.setLanguage(this.state.user.profile.configuration.language);
      if (this.props.history.location.action) {
        if (this.props.history.location.action === "enter") {

        } else if (this.props.history.location.action === "subscribe") {
          this.subscribe(this.props.history.location.course.information._id, "fromPreview");
        } else if (this.props.history.location.action === "unsubscribe") {
          this.handleClickCourse(this.props.history.location.course);
          this.openUnsubscribe(this.props.history.location.course.courseId);
        }
      }
    });
  }

  logOut = () => {
    Meteor.logout((error) => {
      this.props.history.push('/');
    })
  }

  setLanguage = (option) => {
    let language = this.state.language;
    if (option === 'Portuguese (PT)') {
      Session.set({language: portuguese});
      language = portuguese;
    }
    else if (option === 'English (US)') {
      Session.set({language: english});
      language = english;
    } 
    else if (option === 'Spanish (ES)') {
      Session.set({language: spanish});
      language = spanish;
    }
    else if (option === 'Polish (PL)') {
      Session.set({language: polish});
      language = polish;
    }
    else if (option === 'Turkish (TR)') {
      Session.set({language: turkish});
      language = turkish;
    }
    this.setState({
      language: language,
    });
    Meteor.call("ChangeLanguague", Meteor.userId(), option, (error, response) =>  {});
  }

  showComponent = (component) => {
    if (!(component === "create" && this.state.component === "create")){
      if (this.state.component === "create" && !this.state.savedCourse){
        if (component !== "create") {
          this.setState({
            savedCourseWindow: true,
            nextComponent: component,
          });
        }
      } else {
        this.setState({
          component: component,
          savedCourse: false,
        });
      }
    }
  }

  handleControlMessage = (show, message, showAction, action, actionMessage, course) => {
    if (show) {
      if (action === 'savedList') {
        action = () => this.showComponent('saved');
      }
      else if (action === 'preview') {
        action = () => this.openDialogWindow("preview");
      }
      if (action === 'stories') {
        action = () => this.showComponent('stories');
      }
      if (action === 'subscribed') {
        action = () => this.showComponent('subscribed');
      }
      if (action === 'dashboard'){
        action = () => this.showComponent('dashboard');
        
      }
      this.setState({
        showControlMessage: show,
        controlMessage: message,
        controlAction: action,
        controlActionMessage: actionMessage,
        showControlAction: showAction,
        course: course,
      });
    }
    else {
      this.setState({
        showControlMessage: show,
      });
    }
  }

  subscribe = (courseId, fromPreview) => {
    this.setState({
      showLoadingMessage: true,
      loadingMessage: this.state.language.joiningClassWait,
    });
    let course = Courses.find({_id: courseId}).fetch();
    this.handleSubscription(course[0], fromPreview);
  }

  unsubscribeFromCourse = (courseId, id) => {
    this.setState({
      showLoadingMessage: true,
      loadingMessage: this.state.language.leavingClassWait,
    })
    let course = Courses.find({_id: courseId}).fetch();
    this.handleUnsubscription(course[0], id);
  }
  
  handleUnsubscription = (course, id) => {
    let removeUserId;
    if (id) {
      removeUserId = id;
    } else {
      removeUserId = Meteor.userId();
    }
    let studentIndex = course.classroom.findIndex(students => students === removeUserId);
    course.classroom.splice(studentIndex, 1);
    Courses.update(
      { _id: course._id },
      { $set: {
        classroom: course.classroom,
      }}
      , () => {
        var user = Meteor.users.findOne({_id: removeUserId});
        let courseIndex = user.profile.courses.findIndex(subscribedCourse => subscribedCourse.courseId === course._id);
        user.profile.courses.splice(courseIndex, 1);
        Meteor.users.update(
          { _id: removeUserId },
          { $set: {
            'profile.courses': user.profile.courses,
          }}
          , () => {
            this.setState({
              unsubscribed: true,
              showLoadingMessage: false,
            }, () => {
              if (this.state.activeCourse !== undefined) {
                this.state.activeCourse.courseId === course._id ? this.closeCourse() : undefined
              }
              this.handleControlMessage(true, id ? this.state.language.studendRemoved : this.state.language.courseRemovedSubs, false, '', '', undefined);
              this.state.component === 'subscribed' ? this.getSubscribedCourses() : undefined
              let user = Meteor.users.find({_id: removeUserId}).fetch();
              this.setState({
                user: user[0],
              });
            });
          }
        )
      }
    )
  }

  getSubscribedCourses = () => {}

  handleSubscription = (course, fromPreview) => {
    course.classroom.push(Meteor.userId());
    Courses.update(
      { _id: course._id },
      { $set: {
        classroom: course.classroom,
      }}
      , () => {
        var user = Meteor.users.findOne({_id: Meteor.userId()});
        var toComplete = this.toComplete(course);
        var toResolve = this.toResolve(course);
        var courseToInsert = {};
        courseToInsert.courseId = course._id;
        courseToInsert.progress = 0;
        courseToInsert.toComplete = toComplete;
        courseToInsert.toResolve = toResolve;
        user.profile.courses.push(courseToInsert);
        Meteor.users.update(
          { _id: Meteor.userId() },
          { $set: {
            'profile.courses': user.profile.courses,
          }}
          , () => {
            this.setState({
              subscribed: true,
              showLoadingMessage: false,
            } , () => {
              this.handleControlMessage(true, this.state.language.addedToSCourses, true, 'subscribed', this.state.language.seeList, undefined);
              let user = Meteor.users.find({_id: Meteor.userId()}).fetch();
              this.setState({
                user: user[0],
              }, () => {
                if (fromPreview) {
                  courseToInsert.information = this.props.history.location.course.information;
                  this.handleClickCourse(courseToInsert);
                }
              });
            });
          }
        )
      }
    )
  }

  handleClickCourse = (course) => {
    console.log(course)
    var user = this.state.user;
    var courseIndex = user.profile.courses.findIndex(subscribedCourse => subscribedCourse.courseId === course.courseId);
    var toComplete = this.toComplete(course.information, user.profile.courses[courseIndex].toComplete);
    var toResolve = this.toResolve(course.information, user.profile.courses[courseIndex].toResolve);
    user.profile.courses[courseIndex].toComplete = toComplete;
    course.toComplete = toComplete;
    user.profile.courses[courseIndex].toResolve = toResolve;
    course.toResolve = toResolve;
    Meteor.users.update(
      {_id: this.state.user._id},
      {$set: {"profile.courses": user.profile.courses}}
    )
    this.setState({
      activeCourse: course,
      showLoadingMessage: true,
      selected: [-1, -1, -1, 0],
      loadingMessage: this.state.language.startingCourse,
    }, () => {
      let course = Courses.find({_id: this.state.activeCourse.information._id}).fetch();
      course = course[0];
      let published = course.published;
      if (published) {
        this.setState({
          showLoadingMessage: false,
        }, () => {
          this.showComponent('course');
        })
      }
      else {
        this.getSubscribedCourses();
      }
    });
  }

  toResolve = (course, toResolveStudent) => {
    let toResolve = [];
    let userCourseIndex = -1;
    if (course.organization.subunit) {
      course.program.map(unit => {
        unit.lessons.map(subunit => {
          subunit.items.map(content => {
            if (content.type === 'quiz' || content.type === 'activity') {
              if (toResolveStudent) {
                userCourseIndex = toResolveStudent.findIndex(item => item._id === content.id);
              }
              if (userCourseIndex >= 0) {
                toResolve.push(toResolveStudent[userCourseIndex])
              } else {
                if (content.type === "activity" && content.attributes.type === "forum" && content.attributes.activityId){
                  toResolve.push({resolved: false, _id: content.id, activityId: content.attributes.activityId});
                } else {
                  toResolve.push({resolved: false, _id: content.id});
                }
              }
            }
          })
        })
      })
    }
    else {
      course.program.map(unit => {
        unit.items.map(content => {
          if (content.type === 'quiz' || content.type === 'activity') {
            if (toResolveStudent) {
              userCourseIndex = toResolveStudent.findIndex(item => item._id === content.id);
            }
            if (userCourseIndex >= 0) {
              toResolve.push(toResolveStudent[userCourseIndex])
            } else {
              if (content.type === "activity" && content.attributes.type === "forum" && content.attributes.activityId){
                toResolve.push({resolved: false, _id: content.id, activityId: content.attributes.activityId});
              } else {
                toResolve.push({resolved: false, _id: content.id});
              }
            }
          }
        })
      })
    }
    return toResolve;
  }

  toComplete = (course, toCompleteStudent) => {
    let toComplete = [];
    if (course.organization.subunit) {
      let parentIndex = 0;
      course.program.map((unit, index) => {
        toComplete.push({subunits: []})
        parentIndex = index;
        unit.lessons.map((subunit, childIndex) => {
          if (toCompleteStudent && toCompleteStudent[parentIndex] && toCompleteStudent[parentIndex].subunits[childIndex]) {
            toComplete[parentIndex].subunits.push(toCompleteStudent[parentIndex].subunits[childIndex])
          } else {
            toComplete[parentIndex].subunits.push(false);
          }
        })
      })
    }
    else {
      course.program.map((unit, index) => {
        if (toCompleteStudent && toCompleteStudent[index]) {
          toComplete.push(toCompleteStudent[index])
        } else {
          toComplete.push(false);
        }
      })
    }
    return toComplete;
  }

  openDialogWindow = (value) => {
    this.setState({
      actionType: value,
    }, () => {this.showPreview()})
  }

  showPreview = () => {
    this.setState({
      openDialog: true,
    })
  }

  editCourse = (course) => {
    this.setState({
      courseToEdit: course,
    }, () => {
      this.showComponent('edit');
    });
  }

  editStory = (story) => {
    this.setState({
      storyToEdit: story,
    }, () => {
      if (story.activity.type === "storytelling") {
        this.showComponent('storytellingEdit');
      } else {
        this.showComponent('storytellingEdit-time');
      }
    });
  }

  handleClose = () => {
    this.setState({ 
      chekingSesion: false,
      openDialog: false, 
    });
  };

  handleCloseSave = () => {
    this.setState({ 
      savedCourseWindow: false,
      savedCourse: false,
      component: this.state.nextComponent, 
    });
  }

  savedCourseState = () => {
    this.setState({
      savedCourse: true, 
    });
  }

  saveCourse = () => {
    this.refs.CreateCourse.saveCourse();
    this.setState({ 
      savedCourseWindow: false,
    });
  }

  searchValue=(value)=>{
    this.setState({
      searchText: value,
      component: 'courses',
    })
  }

  cleanSearchText = () => {
    this.setState({
      searchText: undefined,
    })
  }

  closeCourse = () => {
    this.setState({
      activeCourse: undefined,
      selected: [-1, -1],
    })
  }

  openUnsubscribe = (courseId) => {
    this.setState({
      courseToUnsubscribe: courseId,
    }, () => {this.openDialogWindow("unsubscribe")});
  }

  confirmUnsubscribe = () => {
    StudentLog.insert({ 
      "UserId": Meteor.userId(), 
      "CourseId" : this.state.courseToUnsubscribe, 
      "Datetime": new Date(), 
      "Action": "Course Unsubscribe" 
    });
    if (this.state.component === 'course') this.showComponent('subscribed');
    this.unsubscribeFromCourse(this.state.courseToUnsubscribe);
    this.handleClose();
  }

  render() {
    return(
      <div>
        <MuiThemeProvider theme={theme}>
          {
            this.state.language && Session.get('language') ?
              <React.Fragment>
                <div id="outer-container">
                  {
                    this.state.user !== undefined ?
                      <MainMenu
                        user={this.state.user}
                        language={this.state.language}
                        showComponent={this.showComponent.bind(this)}
                      />
                    :
                    undefined
                  }
                  <main id="page-wrap">
                    <AppBar
                      history={this.props.history}
                      language={this.state.language}
                      setLanguage={this.setLanguage.bind(this)}
                      user={this.state.user}
                      logOut={this.logOut.bind(this)}
                      showComponent={this.showComponent.bind(this)}
                      searchValue={this.searchValue}
                    />
                    {
                      this.state.component === 'home' ?
                        <Presentation
                          language={this.state.language}
                          history={this.props.history}
                          searchValue={this.searchValue}
                        />
                      :
                      undefined
                    }
                    {
                      this.state.component === 'published' ?
                        <PublishedCoursesList
                          user={this.state.user}
                          language={this.state.language}
                          unsubscribe={this.unsubscribeFromCourse.bind(this)}
                          showComponent={this.showComponent.bind(this)}
                          handleControlMessage={this.handleControlMessage.bind(this)}
                        />
                      :
                      undefined
                    }
                    {
                      this.state.component === 'saved' ?
                        <SavedCoursesList
                          user={this.state.user}
                          language={this.state.language}
                          handleControlMessage={this.handleControlMessage.bind(this)}
                          showComponent={this.showComponent.bind(this)}
                          editCourse={this.editCourse.bind(this)}
                        />
                      :
                      undefined
                    }
                    {
                      this.state.component === 'create' || this.state.component === 'edit' ?
                        <CreateCourse
                          ref="CreateCourse"
                          savedCourseState={this.savedCourseState.bind(this)}
                          language={this.state.language}
                          user={this.state.user}
                          courseToEdit={this.state.component === 'edit' ? this.state.courseToEdit : undefined}
                          handleControlMessage={this.handleControlMessage.bind(this)}
                          showComponent={this.showComponent.bind(this)}
                        />
                      :
                      undefined
                    }
                    {
                      this.state.component === 'course' ?
                        <Course
                          user={this.state.user}
                          language={this.state.language}
                          selected={this.state.selected}
                          activeCourse={this.state.activeCourse}
                          unsubscribe={this.openUnsubscribe.bind(this)}
                          showComponent={this.showComponent.bind(this)}
                          reRender={this.forceUpdate.bind(this)}
                          handleControlMessage={this.handleControlMessage.bind(this)}
                        />
                      :
                      undefined
                    }
                    {
                      this.state.component === 'courses' ?
                        <CoursesDashboard
                          user={this.state.user}
                          language={this.state.language}
                          subscribe={this.subscribe.bind(this)}
                          unsubscribe={this.openUnsubscribe.bind(this)}
                          disabled={this.state.showLoadingMessage}
                          handleControlMessage={this.handleControlMessage.bind(this)}
                          searchText={this.state.searchText ? this.state.searchText : undefined}
                          cleanSearchText={this.cleanSearchText.bind(this)}
                        />
                      :
                      undefined
                    }
                    {
                      this.state.component === 'subscribed' ?
                        <SubscribedCourses
                          tabIndex="-1"
                          user={this.state.user}
                          language={this.state.language}
                          unsubscribe={this.openUnsubscribe.bind(this)}
                          disabled={this.state.showLoadingMessage}
                          getSubscribedCourses={subscribedCourses => this.getSubscribedCourses = subscribedCourses}
                          handleControlMessage={this.handleControlMessage.bind(this)}
                          handleClickCourse={this.handleClickCourse.bind(this)}
                          showComponent={this.showComponent.bind(this)}
                        />
                      :
                      undefined
                    }
                    {
                      this.state.component === 'storytelling' || this.state.component === 'storytellingEdit' ?
                        <StorytellingTool
                          user={this.state.user}
                          language={this.state.language}
                          storyToEdit={this.state.component === 'storytellingEdit' ? this.state.storyToEdit : undefined}
                          handleControlMessage={this.handleControlMessage.bind(this)}
                        />
                      :
                      undefined
                    }
                    {
                      this.state.component === 'storytelling-time' || this.state.component === 'storytellingEdit-time' ?
                        <StorytellingToolTime
                          user={this.state.user}
                          language={this.state.language}
                          storyToEdit={this.state.component === 'storytellingEdit-time' ? this.state.storyToEdit : undefined}
                          handleControlMessage={this.handleControlMessage.bind(this)}
                        />
                      :
                      undefined
                    }
                    {
                      this.state.component === 'stories' ?
                        <Stories
                          user={this.state.user}
                          language={this.state.language}
                          showComponent={this.showComponent.bind(this)}
                          editStory={this.editStory.bind(this)}
                          handleControlMessage={this.handleControlMessage.bind(this)}
                        />
                      :
                      undefined
                    }
                    {
                      this.state.component === 'dashboard' ?
                        <DashboardComponent/>
                      :
                        undefined
                    }
                    {
                      this.state.component === 'certificates' ?
                        <MyCertificates
                          user={this.state.user}
                          language={this.state.language}
                          disabled={this.state.showLoadingMessage}
                          getSubscribedCourses={subscribedCourses => this.getSubscribedCourses = subscribedCourses}
                          handleControlMessage={this.handleControlMessage.bind(this)}
                          handleClickCourse={this.handleClickCourse.bind(this)}
                          showComponent={this.showComponent.bind(this)}
                        />
                      :
                      undefined
                    }
                    {
                      this.state.component === 'account' ?
                        <AccountManagement
                          language={this.state.language}
                          user={this.state.user}
                          handleControlMessage={this.handleControlMessage.bind(this)}
                          showErrorFunction={showError => this.showError = showError}
                          reRender={this.forceUpdate.bind(this)}
                        />
                      :
                      undefined
                    }
                    {
                      this.state.component === 'help' ?
                        <Help
                          language={this.state.language}
                          user={this.state.user}
                          handleControlMessage={this.handleControlMessage.bind(this)}
                        />
                      :
                      undefined
                    }
                  </main>
                </div>
                <ControlSnackbar
                  showControlMessage={this.state.showControlMessage}
                  showControlAction={this.state.showControlAction}
                  controlMessage={this.state.controlMessage}
                  controlAction={this.state.controlAction}
                  controlActionMessage={this.state.controlActionMessage}
                  handleControlMessage={this.handleControlMessage.bind(this)}
                  time={this.state.controlMessage==="Quiz successfully done" ? 800: 8000}
                />
                <LoadingSnackbar
                  showLoadingMessage={this.state.showLoadingMessage}
                  loadingMessage={this.state.loadingMessage}
                />
                <Dialog
                  open={this.state.chekingSesion}
                  onClose={this.handleClose}
                  aria-labelledby="alert-dialog-confirmation"
                  aria-describedby="alert-dialog-confirmation"
                  disableBackdropClick={true}
                  disableEscapeKeyDown={true}
                >
                  <DialogTitle className="success-dialog-title" id="alert-dialog-title">{this.state.language.checkingSession}</DialogTitle>
                  <DialogContent className="success-dialog-content">
                    <Loading message={this.state.language.loadingUser}/>
                  </DialogContent>
                </Dialog>
                <Dialog
                  open={this.state.openDialog}
                  onClose={this.handleClose}
                  aria-labelledby="alert-dialog-confirmation"
                  aria-describedby="alert-dialog-confirmation"
                >
                  <DialogTitle className="success-dialog-title" id="alert-dialog-title">
                    {this.state.actionType === "preview" ?  this.state.language.coursePreview : this.state.language.unsubscribeCourse}
                  </DialogTitle>
                  <DialogContent className="success-dialog-content">
                    <DialogContentText className="success-dialog-content-text" id="alert-dialog-description">
                      {this.state.actionType === "preview" ? this.state.language.willBeRedirected : this.state.language.sureLeaveClassroom}
                    </DialogContentText>
                    <WarningIcon tabIndex="-1" className="warning-dialog-icon"/>  
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => this.handleClose()} color="primary" autoFocus>
                      {this.state.language.cancel}
                    </Button>
                    {
                      this.state.actionType === "preview" ?
                        <Link className="button-link"
                          target="_blank"
                          to={{
                            pathname: "/coursePreview",
                            hash: this.state.course,
                            state: { fromDashboard: true },
                          }}
                        >
                          <Button color="primary" autoFocus onClick={() => this.handleClose()}>
                            {this.state.language.yes}
                          </Button>
                        </Link>
                      :
                        <Button color="primary" autoFocus onClick={() => this.confirmUnsubscribe()}>
                          {this.state.language.yes}
                        </Button>
                    }
                  </DialogActions>
                </Dialog>
                <Dialog
                  open={this.state.savedCourseWindow}
                  onClose={this.handleClose}
                  aria-labelledby="alert-dialog-confirmation"
                  aria-describedby="alert-dialog-confirmation"
                >
                  <DialogTitle className="success-dialog-title" id="alert-dialog-title">{this.state.language.saveCourse}</DialogTitle>
                  <DialogContent className="success-dialog-content">
                    <DialogContentText className="success-dialog-content-text" id="alert-dialog-description">
                      {this.state.language.saveCourseLost}
                    </DialogContentText>
                    <WarningIcon className="warning-dialog-icon"/> 
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => this.handleCloseSave()} color="primary" autoFocus>
                      {this.state.language.no}
                    </Button>
                    <Button onClick={() => this.saveCourse()} color="primary" autoFocus>
                      {this.state.language.yes}
                    </Button>
                  </DialogActions>
                </Dialog>
              </React.Fragment>
            :
            undefined
          }
        </MuiThemeProvider>
      </div>
      );
    }
  }
