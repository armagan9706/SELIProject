import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import FormStepper from '../navigation/FormStepper'; '../'
import CourseInformation from '../course/CourseInformation';
import CourseRequirements from '../course/CourseRequirements';
import CourseCreatorTool from '../course/CourseCreatorTool';
import { Meteor } from 'meteor/meteor';
import InfoIcon from '@material-ui/icons/Info';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import SchoolIcon from '@material-ui/icons/School';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { Courses } from '../../../lib/CourseCollection';
import { Activities } from '../../../lib/ActivitiesCollection';


export default class CreateCourse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courseSteps: [
        {label: this.props.language.information, icon: <InfoIcon className="step-icon"/>},
        {label: this.props.language.requirements, icon: <PlaylistAddCheckIcon className="step-icon"/>},
        {label: this.props.language.program, icon: <SchoolIcon className="step-icon"/>},
      ],
      courseInformation: {
        title: '',
        subtitle: "",
        description: '',
        language: '',
        keyWords: [],
        image: undefined,
        sylabus: undefined,
        duration: 0,
        durationweeks: 0,
        requirements: [],
        support: [],
        organization: '',
        signature:'',
        level:'',
        type:'',
        program: [],
      },
      lists: [],
      buildedItems: false,
      expandedNodes: [],
      selected: [0, 0],
      saved: false,
      action: "",
    }
  }

  showControlMessage(){
  }

  componentDidMount() {
    if (this.props.courseToEdit){
      this.setState({
        courseInformation: {
          title: this.props.courseToEdit.title,
          subtitle: this.props.courseToEdit.subtitle,
          description: this.props.courseToEdit.description,
          language: this.props.courseToEdit.language,
          keyWords: this.props.courseToEdit.keyWords,
          image: this.props.courseToEdit.image,
          sylabus: this.props.courseToEdit.sylabus,
          duration: this.props.courseToEdit.duration,
          requirements: this.props.courseToEdit.requirements,
          support: this.props.courseToEdit.support,
          organization: this.props.courseToEdit.organization,
          program: this.props.courseToEdit.program,
          classroom: this.props.courseToEdit.classroom,
        },
        saved: this.props.courseToEdit._id,
      }, () => {this.loadingData()})
    } else {this.loadingData()}
  }

  loadingData = () => {
    this.setState({
      courseForms: [
        <CourseInformation
          courseInformation={this.state.courseInformation}
          handleControlMessage={this.props.handleControlMessage.bind(this)}
          language={this.props.language}
        />,
        <CourseRequirements
          courseInformation={this.state.courseInformation}
          lists={this.state.lists}
          buildedItems={this.state.buildedItems}
          handleControlMessage={this.props.handleControlMessage.bind(this)}
          language={this.props.language}
        />,
        <CourseCreatorTool
          courseInformation={this.state.courseInformation}
          expandedNodes={this.state.expandedNodes}
          selected={this.state.selected}
          handleControlMessage={this.props.handleControlMessage.bind(this)}
          handlePreview={this.handlePreview.bind(this)}
          language={this.props.language}
        />,
      ],
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.language.languageIndex !== this.props.language.languageIndex) {
      this.setState({
        courseSteps: [
          {label: this.props.language.information, icon: <InfoIcon className="step-icon"/>},
          {label: this.props.language.requirements, icon: <PlaylistAddCheckIcon className="step-icon"/>},
          {label: this.props.language.program, icon: <SchoolIcon className="step-icon"/>},
        ]});
      this.loadingData();
    }
  }

  publishCourse() {
    if (this.validatePublishCourse()) {
      this.saveCourse();
      if (this.state.saved) {
        Courses.update(
          { _id: this.state.saved },
          { $set: {published: true}}
        );
        this.props.showComponent('published')
        this.props.handleControlMessage(true, this.props.language.coursePublishedS, true, 'preview', this.props.language.seePreview, this.state.saved);
      } else {
        this.props.handleControlMessage(true, this.props.language.saveCourse);
      }
    }
  }

  saveCourse() {
    if (this.validateSaveCourse()) {
      let user = Meteor.user();
      let courseInformation = this.state.courseInformation;
      let course;
      let valueSubtitle = courseInformation.subtitle;
      let valueduration = courseInformation.duration;
      if (valueSubtitle === undefined) {
        valueSubtitle = "-----"
      }
      if (valueduration === undefined) {
        valueduration = "0"
      }
      if (!this.state.saved) {
        courseInformation.creationDate = new Date();
        courseInformation.createdBy = user.username;
        courseInformation.published = false;
        courseInformation.classroom = [];
        course = Courses.insert(courseInformation);
        this.setState({
          saved: course,
        });
        this.props.savedCourseState();
        this.props.createForum(courseInformation, course);
      }
      else {
        Courses.update(
          { _id: this.state.saved },
          { $set:
            {
              title: courseInformation.title,
              subtitle: valueSubtitle,
              description: courseInformation.description,
              language: courseInformation.language,
              keyWords: courseInformation.keyWords,
              image: courseInformation.image,
              sylabus: courseInformation.sylabus,
              duration: valueduration,
              durationweeks: courseInformation.durationweeks,
              requirements: courseInformation.requirements,
              support: courseInformation.support,
              organization: courseInformation.organization,
              program: courseInformation.program,
              classroom: courseInformation.classroom,
              creationDate: new Date(),
            }
          }
        );
        this.props.savedCourseState();
        this.createForum(courseInformation, this.state.saved);
      }
      this.props.handleControlMessage(true, this.props.language.courseSavedS, true, 'savedList', this.props.language.seeList);
    }
  }

  createForum = (course, courseId) => {
    if (course.organization.subunit) {
      course.program.map((unit, index)=> {
        let unitIndex = index;
        unit.lessons.map((lesson, index) => {
          let lessonIndex = index;
          lesson.items.map((item, index)=> {
            if (item.type === "activity" && item.attributes.type === "forum" && item.attributes.activityId === undefined){
              this.createForumItem(item.id, courseId, unitIndex, index, lessonIndex);
            }
          })
        })
      })
    } else {
      course.program.map((topic, index) => {
        let topicIndex = index;
        topic.items.map((item, index) => {
          if (item.type === "activity" && item.attributes.type === "forum" && item.attributes.activityId === undefined){
            this.createForumItem(item.id, courseId, topicIndex, index);
          }
        })
      })
    }
  }

  createForumItem = (itemId, courseId, parentIndex, index, childIndex) => {
    let courseInformation = this.state.courseInformation;
    let activity = {
      data: [],
      type: 'forum',
      public: false,
    }
    let activityId;
    if (itemId && courseId) {
      activity.date = new Date();
      activity.user = Meteor.userId();
      activity.course = courseId;
      activityId = Activities.insert({
        activity
      });
    }
    let program = Courses.findOne({_id: courseId}).program;
    if (childIndex) {
      program[parentIndex].lessons[childIndex].items[index].attributes.activityId = activityId;
    } else {
      program[parentIndex].items[index].attributes.activityId = activityId;
    }
    Courses.update(
      {_id: courseId},
      {$set:{program: program}}
    )
    courseInformation.program = program;
    this.setState({
      courseInformation: courseInformation,
    })
  }

  validatePublishCourse = () => {
    let courseInformation = this.state.courseInformation;
    if (
      courseInformation.title === '' ||
      courseInformation.description === '' ||
      courseInformation.duration === ''
    ) {
      this.props.handleControlMessage(true, `${this.props.language.fieldsMarkedWith} (${this.props.language.step} 1: ${this.props.language.information})`, false, '', '');
      return false;
    }
    else if (courseInformation.image === undefined) {
      this.props.handleControlMessage(true, `${this.props.language.chooseCourseImage} (${this.props.language.step} 1: ${this.props.language.information})`, false, '', '');
      return false;
    }
    else if (courseInformation.sylabus === undefined) {
      this.props.handleControlMessage(true, `${this.props.language.chooseCourseSyllabus} (${this.props.language.step} 1: ${this.props.language.information})`, false, '', '');
      return false;
    }
    else if (!courseInformation.keyWords.length) {
      this.props.handleControlMessage(true, `${this.props.language.addOneOrMore} (${this.props.language.step} 1: ${this.props.language.information})`, false, '', '');
      return false;
    }
   /*  else if (courseInformation.duration < 5) {
      this.props.handleControlMessage(true, `${this.props.language.minimumCourseDuration} (${this.props.language.step} 1: ${this.props.language.information})`, false, '', '');
      return false;
    } */
    /* else if (!courseInformation.requirements.length) {
      this.props.handleControlMessage(true, `${this.props.language.technicalRequirement} (${this.props.language.step} 2: ${this.props.language.requirements})`, false, '', '');
      return false;
    }
    else if (!courseInformation.support.length) {
      this.props.handleControlMessage(true, `${this.props.language.disabilitieRequirement} (${this.props.language.step} 2: ${this.props.language.requirements})`, false, '', '');
      return false;
    } */
    else if (courseInformation.organization === '') {
      this.props.handleControlMessage(true, `${this.props.language.organizationRequirement} (${this.props.language.step} 3: ${this.props.language.program})`, false, '', '');
      return false;
    }

    let emptyContent = false;
    if (courseInformation.organization.subunit) {
      courseInformation.program.map(unit => {
        unit.lessons.map(lesson => {
          if (!lesson.items.length) {
            this.props.handleControlMessage(true, `${this.props.language[courseInformation.organization.unit.toLowerCase()]}: ${unit.name} - ${this.props.language[courseInformation.organization.subunit.toLowerCase()]}: ${lesson.name} ${this.props.language.contentRequirement}`, false, '', '');
            emptyContent = true;
          }
        })
      })
    }
    if (!courseInformation.organization.subunit) {
      courseInformation.program.map(unit => {
        if (!unit.items.length) {
          this.props.handleControlMessage(true, `${this.props.language[courseInformation.organization.unit.toLowerCase()]} ${unit.name} ${this.props.language.contentRequirement}`, false, '', '');
          emptyContent = true;
        }
      })
    }
    if (emptyContent) {
      return false;
    }
    return true;
  }

  validateSaveCourse = () => {
    let courseInformation = this.state.courseInformation;
    if (courseInformation.title === '') {
      this.props.handleControlMessage(true, `${this.props.language.titleRequirement} (${this.props.language.step} 1 ${this.props.language.information})`, false, '', '');
      return false;
    }
    if (courseInformation.organization === '') {
      this.props.handleControlMessage(true, `${this.props.language.organizationRequirement} (${this.props.language.step} 3 ${this.props.language.program})`, false, '', '');
      return false;
    }
    return true;
  }

  handlePreview = () => {
    if (this.validatePublishCourse()) {
      this.setState({
        open: true,
        action: "preview",
      })
    }
  }

  handlePublish = () => {
    this.setState({
      open: true,
      action: "publish",
    })
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  confirmPreview = () => {
    this.saveCourse();
    this.handleClose();
  }

  render() {
    return(
      <div>
        {
          this.state.courseForms !== undefined ?
            <FormStepper
              language={this.props.language}
              title={this.props.courseToEdit ? this.props.language.editing : this.props.language.createCourse}
              color="primary"
              steps={this.state.courseSteps}
              forms={this.state.courseForms}
              finalLabel={this.props.language.publishCourse}
              saveLabel={this.props.language.saveCourse}
              finalAction={this.handlePublish.bind(this)}
              saveAction={this.saveCourse.bind(this)}
            />
          :
          undefined
        }
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-confirmation"
          aria-describedby="alert-dialog-confirmation"
        >
          <DialogTitle className="success-dialog-title" id="alert-dialog-title">
            {this.state.action === "preview" ? this.props.language.coursePreview : this.props.language.publishCourse}
          </DialogTitle>
          <DialogContent className="success-dialog-content">
            <DialogContentText className="success-dialog-content-text" id="alert-dialog-description">
              {this.state.action === "preview" ? this.props.language.ifYouWantCP : this.props.language.ifYouWantPC}
            </DialogContentText>
            <InfoIcon className="warning-dialog-icon"/>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleClose()} color="primary" autoFocus>
            {this.props.language.cancel}
            </Button>
            {
              this.state.action === "preview" ?
                <Link className="button-link"
                  //target="_blank"
                  onClick={() => this.confirmPreview()} 
                  to={{
                    pathname: "/coursePreview",
                    hash: this.state.saved,
                    state: { fromDashboard: true },
                  }}
                >
                  <Button color="primary" autoFocus>
                    {this.props.language.saoPreview}
                  </Button>
                </Link>
              :
                <Button onClick={() => this.publishCourse()} color="primary" autoFocus>
                  {this.props.language.ok}
                </Button>
            }
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}
