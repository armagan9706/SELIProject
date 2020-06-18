import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import ListSubheader from '@material-ui/core/ListSubheader';
import RemoveIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import FeedbackHelp from "./feedback";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import Typography from '@material-ui/core/Typography';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import WarningIcon from '@material-ui/icons/Warning';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ListAltIcon from '@material-ui/icons/ListAlt';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import DescriptionSharpIcon from '@material-ui/icons/DescriptionSharp';

const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1)
      // width: "100ch"
    }
  },
  hidden: {
    display: "none"
  },
  formGroup: {
    marginTop: theme.spacing(2)
  },
  listBullet: {
    listStyleType: "disc",
    display: "list-item"
  },
  listItem: {
    flex: "0.2",
    minWidth: "100px"
  },
  addButton: {
    color: theme.palette.secondary.main
  },
  deleteButton: {
    "&:hover": {
      backgroundColor: "#d91e1822"
      //color: "#d91e18"
    }
  },
  saveButton: {
    "& $saveButton:hover": {
      backgroundColor: "#00897b22"
      //color: "#d91e18"
    }
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  }
}));

export default function AnalysisStep(props) {
  const {courseInformation,language } = props;

  useEffect(()=>{
    console.log("courseInformationAnalysisStep y Accesibility", courseInformation,courseInformation.accessibility )
    //updatemodalityradiobutton
    setmodality(courseInformation.analysis[1]);
    //updatetextEditor
    setpedagogical(courseInformation.analysis[2]);
    //update the tooltips
    if(courseInformation.accessibility[2]!=undefined){
      setanalysisTooltip(courseInformation.accessibility[2])
    }
    if(courseInformation.analysis[3]!=undefined){
      setGoals(courseInformation.analysis[3])
    }
    if(courseInformation.analysis[4]!=undefined){
      setOutcomes(courseInformation.analysis[4])
    }
   
  },[])

  

  useEffect(()=>{// 
    console.log("INFO cOURSE Analysis:modality, pedagogical,constraints",modality, pedagogical,constraints)
        if(modality!=undefined && pedagogical!=undefined &&
           analysisTooltip.learningobjectives===false  && analysisTooltip.outcomes===false ){
            props.validate('passCourseAnalysis')
        } 
        if(modality===undefined || pedagogical==='' || 
           analysisTooltip.learningobjectives===true  || analysisTooltip.outcomes===true){
           props.validate('NopassCourseAnalysis')
          
        }
  })

  const [openT, setOpenT] = React.useState(false);
  const [openA, setOpenA] = React.useState(false);
  const [openS, setOpenS] = React.useState(false);
  const [openI, setOpenI] = React.useState(false);
  const [analysisTooltip, setanalysisTooltip]= useState({
    pedagogical: true,
    modality: true,
    learningobjectives: true,
    outcomes:true
  })
  const [courseinformation, setcourseInformation]=useState(courseInformation)
  const [modality, setmodality]=useState('');
  const [pedagogical, setpedagogical]=useState('');
  //for save he accesibility status

  const [typetodelete ,settypetodelete]=useState('');
  const classes = useStyles();
  const [data, setData] = useState({
    courseTitle: "Computer Science 101",
    courseSubTitle: "Programming with a Purpose",
    learningGoals: [],
    audience: ["Graduatade students", "Teachers and Professors"],
    inclusion: ["elderly"],
    constraints: ["Calcule I", "Math"]
  });
  const [controlEdit, setControlEdit] = useState({
    tempValue: "",
    tempAuxValue: "",
    adding: false,
    editing: false
  });
  const [feedbackError, setfeedbackError]=useState(true)
  const [feedbackErrorLearningO, setfeedbackErrorLearningO]=useState(true)
  const [constraints, setConstraints] = useState([
    {
      label: "Math 101 (example)",
      editing: false
    }
  ]);

  
  const [goals, setGoals] = useState({
		creating: [],
		evaluating: [],
		analyzing: [],
		understand: [],
		remembering: []
	});


  const [goalsTaxonomy, setGoalsTaxonomy] = useState({
		creating: [
			{ key: "build", label: "to build" },
			{ key: "develop", label: "to develop" },
			{ key: "combine", label: "to combine" },
			{ key: "design", label: "to design" },
			{ key: "elaborate", label: "to elaborate" }
		],
		evaluating: [
			{ key: "conclude", label: "to conclude" },
			{ key: "critique", label: "to critique" },
			{ key: "justify", label: "to justify" },
			{ key: "prove", label: "to prove" },
			{ key: "judge", label: "to judge" }
		],
		analyzing: [
			{ key: "constrast", label: "to constrast" },
			{ key: "categorize", label: "to categorize" },
			{ key: "classify", label: "to classify" },
			{ key: "list", label: "to list" },
			{ key: "compare", label: "to compare" }
		],
		understand: [
			{ key: "explain", label: "to explain" },
			{ key: "summarize", label: "to summarize" },
			{ key: "paraphrase", label: "to paraphrase" },
			{ key: "illustrate", label: "to illustrate" },
			{ key: "extend", label: "to extend" }
		],
		remembering: [
			{ key: "duplicate", label: "to duplicate" },
			{ key: "match", label: "to match" },
			{ key: "describe", label: "to describe" },
			{ key: "show", label: "to show" },
			{ key: "choose", label: "to choose" }
		]
	});

  const [outcomes, setOutcomes] = useState({
    contents: [],
    skills: [],
    values: []
  });

  const [outcomesTaxonomy, setOutcomesTaxonomy] = useState({
		contents: [
			{ key: "understand", label: "to understand" },
			{ key: "categorize", label: "to categorize" },
			{ key: "describe", label: "to describe" },
			{ key: "reproduce", label: "to reproduce" },
			{ key: "compare", label: "to compare" }
		],
		skills: [
			{ key: "design", label: "to design" },
			{ key: "conduct", label: "to conduct" },
			{ key: "evaluate", label: "to evaluate" },
			{ key: "analyse", label: "to analyse" },
			{ key: "measure", label: "to measure" }
		],
		values: [
			{ key: "appreciate", label: "to appreciate" },
			{ key: "act", label: "to act" },
			{ key: "work", label: "to work" },
			{ key: "aware", label: "to aware" },
			{ key: "value", label: "to value" }
		]
	});

  const [labels, setlables]=useState({
    IntendedAudience:language.IntendedAudience,
    IntendedInclusion:language.IntendedInclusion,
    CourseTitle:language.CourseTitle,
    CourseSubtitle:language.CourseSubtitle,
    errorMsg:language.errorMsg,
    errorMsgleast:language.errorMsgleast,
    completeObjective:language.completeObjective,
    analysisphase:language.analysisphase,
    knowledgeObjectives:language.knowledgeObjectives ,
    skillsobjectives:language.skillsobjectives,
    attitudesobjectives:language.attitudesobjectives,
    titleLO:language.titleLO,
    tipmsgLO:language.tipmsgLO,
    subtitleLO:language.subtitleLO,
    subtitleSO:language.subtitleSO,
    subtitleAO:language.subtitleAO,
    learningconstraint:language.learningconstraint,
    repeated:language.repeated,
    modality:language.modality,
    delivercontent:language.delivercontent,
    pedagogical:language.pedagogical,
    pedagogicalconsiderations:language.pedagogicalconsiderations,
    learningCon:language.learningCon,
    errorMsgall:language.errorMsgall
  })
  const [message, setmessage]=useState(labels.errorMsg)
  const [open, setopen]= useState(false)
  const [labelindexdelete, setlabelindexdelete]=useState("")
  const [indexdelete,  setindexdelete]=useState(0)
  const [categori, setcategory]=useState('');

  const handleNewConstraint = () => {
    setConstraints([
      ...constraints,
      { label: "New constraint", editing: true }
    ]);
    setControlEdit({
      tempValue: "To create",
      adding: true,
      editing: true
    });
  };
 
  const handleCancelEditLearning = (index, category) => {
    if (controlEdit.adding) deleteLearning(index, category);
		else {
			let atts = goals[category];
			atts[index].editing = false;
			let newGoals = goals;
			newGoals[category] = atts;
			setGoals(newGoals);
		}
		setControlEdit({
			tempValue: "",
			tempAuxValue: "",
			adding: false,
			editing: false
		});
  };

  function deleteLearning(index, category) {
    let atts = goals[category];
		if (index === 0) atts = [...atts.slice(1)];
		else if (index === goals[category].length - 1)
			atts = [...atts.slice(0, index)];
		else atts = [...atts.slice(0, index), ...atts.slice(index + 1)];
    
		let newGoals = goals;
		newGoals[category] = atts;
    setGoals(newGoals);
    let addNewknowledges=courseinformation;
    addNewknowledges.analysis[3]=newGoals;
    setcourseInformation(addNewknowledges) 

    let countError=0
    Object.keys(goals).map((category, index) => {
      if(goals[category].length===0){
        countError+=1;
      }
      if(countError===5){
        setanalysisTooltip(prev=>{
          return {...prev, learningobjectives:false}
        })
        setanalysisTooltip(prev=>{
          return {...prev, learningobjectives: true}
        })
        let learningobj=courseinformation;
        learningobj.accessibility[2]=analysisTooltip;
        setcourseInformation(learningobj);
      }
    })

  }

  const handleEditedLearning = (index, category) => {
    console.log("manda a gaurdar learning", index, category )
    let atts = goals[category];
		atts[index].editing = false;
		atts[index].label = controlEdit.tempValue;
		atts[index].aux = controlEdit.tempAuxValue;

		console.log(controlEdit.tempAuxValue);
		console.log(controlEdit.tempValue);

		let newGoals = goals;
		newGoals[category] = atts;
		console.log(newGoals);
    setGoals(newGoals);

    if(event.target.value!=''){
      setanalysisTooltip((prevState)=>{
        return{...prevState, learningobjectives: false}
      })
    }
    let addNewknowledges=courseinformation;
    addNewknowledges.analysis[3]=newGoals;
    addNewknowledges.accessibility[2]=analysisTooltip;
    setcourseInformation(addNewknowledges)

  

		setControlEdit({
			tempValue: "",
			tempAuxValue: "",
			adding: false,
			editing: false
		});
  };

  const handleEditLearning = (index, category) => {
    let atts = goals[category];
		atts[index].editing = true;
		let newGoals = goals;
		newGoals[category] = atts;
    setGoals(newGoals);
    let addNewknowledges=courseinformation;
    addNewknowledges.analysis[3]=goals;
    setcourseInformation(addNewknowledges)

		setControlEdit({
			tempValue: atts[index].label,
			tempAuxValue: atts[index].aux,
			adding: false,
			editing: true
		});
  };

  const handleDeleteLearning = (index, category) => {
		setopen(true)
     setindexdelete(index)
     setlabelindexdelete(goals[category][index].label)
     setcategory(category)
     settypetodelete('LearningObjectives')
		 //deleteLearning(index, category);
		
	};

  const handleNewOutcomes = category => {
		console.log(category);
		setOutcomes({
			...outcomes,
			[category]: [
				...outcomes[category],
				{
					label: "New outcomes",
					aux: outcomesTaxonomy[category][0].key,
					editing: true
				}
			]
		});
		setControlEdit({
			tempValue: "",
			tempAuxValue: outcomesTaxonomy[category][0].key,
			adding: true,
			editing: true
		});
  };
  
  const handleCancelEditOutcome = (index, category) => {
		if (controlEdit.adding) deleteOutcome(index, category);
		else {
			let atts = outcomes[category];
			atts[index].editing = false;
			let newOutcomes = outcomes;
			newOutcomes[category] = atts;
			setOutcomes(newOutcomes);
		}
		setControlEdit({
			tempValue: "",
			tempAuxValue: "",
			adding: false,
			editing: false
		});
	};

	function deleteOutcome(index, category) {
		let atts = outcomes[category];
		if (index === 0) atts = [...atts.slice(1)];
		else if (index === outcomes[category].length - 1)
			atts = [...atts.slice(0, index)];
		else atts = [...atts.slice(0, index), ...atts.slice(index + 1)];

		let newGoals = outcomes;
		newGoals[category] = atts;
    setOutcomes(newGoals);
    let countError=0
    Object.keys(outcomes).map((category, index) => {
      if(outcomes[category].length===0){
        countError+=1;
      }
      if(countError>=1){
        setanalysisTooltip(prev=>{
          return {...prev, outcomes: true}
        })
        let learningobj=courseinformation;
        learningobj.accessibility[2]=analysisTooltip;
        setcourseInformation(learningobj);
      }
    }) 
      let learningobj=courseinformation;
      learningobj.accessibility[2]=analysisTooltip;
      learningobj.analysis[4]=newGoals;
      setcourseInformation(learningobj);
	}

	const handleEditedOutcome = (index, category) => {
		let atts = outcomes[category];
		atts[index].editing = false;
		atts[index].label = controlEdit.tempValue;
		atts[index].aux = controlEdit.tempAuxValue;
		let newGoals = outcomes;
		newGoals[category] = atts;
    setOutcomes(newGoals);
    
    let countError=0
    Object.keys(outcomes).map((category, index) => {
      if(outcomes[category].length!=0){
        countError+=1;
      }
      if(countError===3){
        setanalysisTooltip(prev=>{
          return {...prev, outcomes: false}
        })
        let learningobj=courseinformation;
        learningobj.accessibility[2]=analysisTooltip;
        setcourseInformation(learningobj);
      }
    })

    let addNewknowledges=courseinformation;
    addNewknowledges.analysis[4]=newGoals;
    addNewknowledges.accessibility[2]=analysisTooltip;
    setcourseInformation(addNewknowledges)

		setControlEdit({
			tempValue: "",
			tempAuxValue: "",
			adding: false,
			editing: false
		});
	};

	const handleEditOutcome = (index, category) => {
		let atts = outcomes[category];
		atts[index].editing = true;
		let newGoals = outcomes;
		newGoals[category] = atts;
    setOutcomes(newGoals);
    let addNewknowledges=courseinformation;
    addNewknowledges.analysis[4]=goals;
    setcourseInformation(addNewknowledges)

		setControlEdit({
			tempValue: atts[index].label,
			tempAuxValue: atts[index].aux,
			adding: false,
			editing: true
		});
	};

	const handleDeleteOutcome = (index, category) => {
    setopen(true)
     setindexdelete(index)
     setlabelindexdelete(outcomes[category][index].label)
     setcategory(category)
     settypetodelete('outcomes')
	};

  const handleNewLearning = category => {
		console.log("la categoria.....",category);
		setGoals({
			...goals,
			[category]: [
				...goals[category],
				{
					label: "New Learning",
					aux: goalsTaxonomy[category][0].key,
					editing: true
				}
			]
    });
    
    let addNewknowledges=courseinformation;
    addNewknowledges.analysis[3]=goals;
    setcourseInformation(addNewknowledges) 

		setControlEdit({
			tempValue: "",
			tempAuxValue: goalsTaxonomy[category][0].key,
			adding: true,
			editing: true
		});
	};

  const handleDeleteRequisite = index => () => {   
     setopen(true)
     setindexdelete(index)
     setlabelindexdelete(constraints[index].label)
      //deleteRequisite(index);
  };

  const handleEditRequisite = unit => () => {
    let newUnits = [...constraints];
    newUnits[unit].editing = true;
    setConstraints(newUnits);
    setControlEdit({
      tempValue: newUnits[unit].label,
      adding: false,
      editing: true
    });
  };

  const handleEditedRequisite = index => () => {
    let validRequisites= validateRequisites()
    if(validRequisites==="noequal"){
      let newRequisites = [...constraints];
      newRequisites[index].editing = false;
      newRequisites[index].label = controlEdit.tempValue;
      setConstraints(newRequisites);
      setControlEdit({ tempValue: "", adding: false, editing: false });
      let addNewRequisites=courseinformation;
      addNewRequisites.analysis[0]=newRequisites
      setcourseInformation(addNewRequisites)
      
    }
  };

  const validateRequisites=()=>{
    let requisitesArray=[]
    constraints.map((audience, index)=>{
    requisitesArray.push(audience.label.toLowerCase())
    })
    
    let valueinOtherArray=requisitesArray.find((audience)=>{return audience===controlEdit.tempValue.toLowerCase() })
    if(valueinOtherArray!=undefined){
      console.log("coincide")
       setfeedbackError(true)
       setmessage(labels.repeated)
       return "equal"
    }else{
        console.log("no coincide")
        return "noequal"
    }   
  }
  const handleCancelEditRequisite = index => () => {
    if (controlEdit.adding) deleteRequisite(index,'requisite');
    else {
      let newUnits = [...constraints];
      newUnits[index].editing = false;
      setConstraints(newUnits);
    }
    setControlEdit({ tempValue: "", adding: false, editing: false });
  };

  function deleteRequisite(index ,category) {
    if (category === "knowledges") {
      let atts = goals.knowledges;

      if (index === 0) atts = [...atts.slice(1)];
      else if (index === goals.knowledges.length - 1)
        atts = [...atts.slice(0, index)];
      else atts = [...atts.slice(0, index), ...atts.slice(index + 1)];

      let newGoals = goals;
      newGoals.knowledges = atts;
      setGoals(newGoals);
    }
    if (category === "skills") {
      let atts = goals.skills;

      if (index === 0) atts = [...atts.slice(1)];
      else if (index === goals.skills.length - 1)
        atts = [...atts.slice(0, index)];
      else atts = [...atts.slice(0, index), ...atts.slice(index + 1)];

      let newGoals = goals;
      newGoals.skills = atts;
      setGoals(newGoals);
    }
    if (category === "attitudes") {
      let atts = goals.attitudes;

      if (index === 0) atts = [...atts.slice(1)];
      else if (index === goals.attitudes.length - 1)
        atts = [...atts.slice(0, index)];
      else atts = [...atts.slice(0, index), ...atts.slice(index + 1)];

      let newGoals = goals;
      newGoals.attitudes = atts;
      setGoals(newGoals);
    }else{
      let newRequisites = [...constraints];
      if (index === 0) newRequisites = [...newRequisites.slice(1)];
      else if (index === constraints.length - 1)
        newRequisites = [...newRequisites.slice(0, index)];
      else
        newRequisites = [
          ...newRequisites.slice(0, index),
          ...newRequisites.slice(index + 1)
        ];
      setConstraints(newRequisites);
      setData(prev => {
        prev.constraints = newRequisites.map(req => req.label);
        return prev;
      });
      let addNewRequisites=courseinformation;
      addNewRequisites.analysis[0]=newRequisites
      setcourseInformation(addNewRequisites)
      }
  }

  function updateTempValue(value) {
    console.log("updateTempValue",value)
    setControlEdit(prev => {
      return { ...prev, tempValue: value };
    });
    if(value!="") {
      setfeedbackError(false)
    }
    else{ setfeedbackError(true)}
    setmessage(labels.errorMsg)
  }

  function updateTempAuxValue(value) {
    console.log("updateTempAuxValue",value)
    setControlEdit(prev => {
      return { ...prev, tempAuxValue: value };
    });
  }
  const handleClose = () => {  
    setopen(false)
  };
  const handleClickT = () => {
    setOpenT(!openT);
  };
  const handleClickS = () => {
    setOpenS(!openS);
  };
  const handleClickA = () => {
    setOpenA(!openA);
  };
  const handleClickI = () => {
    setOpenI(!openI);
  };

  
  return (
    <div className="form-input-audiences">
     <h2>Analysis Phase</h2>
      {/* <Typography variant="h6" className={classes.title}>Analysis Phase</Typography> */}
      <p>
        {labels.analysisphase}
      </p>
      <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader disableSticky={true} component="div" id="nested-list-subheader">      
                <Typography variant="h6" className={classes.title}>Course summary</Typography>	
            </ListSubheader>
          }
          className={classes.root}
        >
          <ListItem button onClick={handleClickT}>
              <ListAltIcon>
                <InboxIcon />
              </ListAltIcon>
              <ListItemText primary={labels.CourseTitle} />
              {openT ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openT} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button className={classes.nested}>
                <DescriptionSharpIcon>
                  <StarBorder />
                </DescriptionSharpIcon>
                <ListItemText primary={courseinformation.title} />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button onClick={handleClickS}>
              <ListAltIcon>
                <InboxIcon />
              </ListAltIcon>
              <ListItemText primary={labels.CourseSubtitle} />
              {openS ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openS} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button className={classes.nested}>
                <DescriptionSharpIcon>
                  <StarBorder />
                </DescriptionSharpIcon>
                <ListItemText primary={courseinformation.subtitle} />
              </ListItem>
            </List>
          </Collapse>


          <ListItem button onClick={handleClickA}>
              <ListAltIcon>
                <InboxIcon />
              </ListAltIcon>
              <ListItemText primary={labels.IntendedAudience} />
              {openA ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openA} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
            {courseinformation.support[0].map((audience, index) => (
                  audience.isChecked==true?
                  <ListItem button className={classes.nested}>
                      <LocalLibraryIcon>
                          <StarBorder />
                        </LocalLibraryIcon>
                    <ListItemText primary={audience.label} />
                  </ListItem>
                    :
                    undefined
                ))}
            {courseinformation.support[2]!=undefined?
                  courseinformation.support[2].map((audience, index) => (
                    <ListItem button className={classes.nested}>
                        <LocalLibraryIcon>
                          <StarBorder />
                        </LocalLibraryIcon>
                      <ListItemText primary={audience.label} />
                   </ListItem>
                  ))
                :
                undefined
            }
            </List>
          </Collapse>

          <ListItem button onClick={handleClickI}>
              <ListAltIcon>
                <InboxIcon />
              </ListAltIcon>
              <ListItemText primary={labels.IntendedAudience} />
              {openI ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openI} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {courseinformation.support[1].map((audience, index) => (
                    audience.isChecked==true?
                    <ListItem button className={classes.nested}>
                      <AccessibilityIcon>
                        <StarBorder />
                      </AccessibilityIcon>
                      <ListItemText primary={audience.label} />
                    </ListItem>
                      :
                      undefined
              ))}     
            </List>
          </Collapse>
        </List>
      
      <Grid container className={classes.formGroup}>
          <Grid item xs={12} className="MuiFormLabel-root">
            <Typography variant="h6" className={classes.title}>Learning Objectives</Typography>	
				  </Grid>       
				{Object.keys(goals).map((category, index) => (
					<Grid item xs={12}>
						<Grid item className="MuiFormLabel-root">
							<label>
								{Object.getOwnPropertyNames(goals)[index]} objectives
							</label>
						</Grid>
						<Grid item>
							<form>
								<List component="ul" key={"li0"} id="li0">
									{goals[category].map((goal, index) => (
										<ListItem
											button={!goal.editing}
											component="li"
											key={"li" + index}
											className={classes.listItem}
										>
											<ListItemText
												key={"u2" + index + "listeItemTxt"}
												primary={
													goalsTaxonomy[category].find(
														item => item.key === goal.aux
													).label +
													" " +
													goal.label
												}
												className={goal.editing ? classes.hidden : ""}
											/>
											<Paper className={!goal.editing ? classes.hidden : ""}>		
                      	<TextField
													id="standard-select-currency"
													select
													SelectProps={{
														native: true
													}}
													// variant="outlined"
													value={controlEdit.tempAuxValue}
													onChange={event =>
														updateTempAuxValue(event.target.value)
													}
													className={classes.input}
												>
													{goalsTaxonomy[category].map(option => (
														<option key={option.key} value={option.key}>
															{option.label}
														</option>
													))}
												</TextField>
												<TextField
													key={"u2" + index + "txtField"}
													value={controlEdit.tempValue}
													onChange={event =>
														updateTempValue(event.target.value)
													}
												/>
											</Paper>
											<ListItemSecondaryAction key={"u2" + index + "secAc"}>
												{goal.editing ? (
													<React.Fragment>
														<IconButton
															key={"u2" + index + "btnEditSaveUnit"}
															edge="end"
															aria-label={"Save changes"}
															onClick={() =>
																handleEditedLearning(index, category)
															}
															className={classes.saveButton}
															disabled={controlEdit.tempValue === ""}
														>
															<DoneIcon />
														</IconButton>
														<IconButton
															key={"u2" + index + "btnEditCancelUnit"}
															edge="end"
															aria-label={"Cancel changes"}
															onClick={() =>
																handleCancelEditLearning(index, category)
															}
															className={classes.deleteButton}
														>
															<ClearIcon />
														</IconButton>
													</React.Fragment>
												) : (
													<React.Fragment>
														<IconButton
															key={"u2" + index + "btnEditUnit"}
															edge="end"
															aria-label={"Edit unit name"}
															onClick={() =>
																handleEditLearning(index, category)
															}
															disabled={controlEdit.editing}
														>
															<EditIcon />
														</IconButton>
														<IconButton
															key={"u2" + index + "btnDeleteUnit"}
															edge="end"
															// aria-label={"Delete constraint " + constraint.label}
															onClick={() =>
																handleDeleteLearning(index, category)
															}
															className={classes.deleteButton}
														>
															<RemoveIcon />
														</IconButton>
													</React.Fragment>
												)}
											</ListItemSecondaryAction>
										</ListItem>
									))}
									<ListItem
										key="addrequisite"
										button
										onClick={() => handleNewLearning(category)}
										id="addrequisite"
										disabled={controlEdit.editing}
										className={classes.addButton}
									>
										<AddIcon /> <ListItemText primary="Add" />
									</ListItem>
								</List>
								<FeedbackHelp
									validation={{
										error: false,
										errorMsg: "",
										errorType: "",
										a11y: null
									}}
									tipMsg={category + " objectives are ...."}
									describedBy={"i05-helper-text"}
								/>
							</form>
						</Grid>
					</Grid>
				))}
         <Grid item>
                <FeedbackHelp
                  validation={{
                    error: analysisTooltip.learningobjectives,
                    errorMsg: labels.errorMsgleast,
                    errorType: "",
                    a11y: null
                  }}
                  tipMsg="Add a Learning Objectives that show what the students will know and why they are doing it on three areas of learning: knowledge, skills and attitudes."
                  describedBy={"i05-helper-text"}
                />
              </Grid>
			</Grid>

      <Grid container className={classes.formGroup}>
          <Grid item xs={12} className="MuiFormLabel-root">
            <Typography variant="h6" className={classes.title}>Behavioral Outcomes</Typography>	
				  </Grid>
				{Object.keys(outcomes).map((category, index) => (
					<Grid item xs={12}>
						<Grid item className="MuiFormLabel-root">
							<label>
								{Object.getOwnPropertyNames(outcomes)[index]} objectives
							</label>
						</Grid>
						<Grid item>
							<form>
								<List component="ul" key={"li0"} id="li0">
									{outcomes[category].map((outcome, index) => (
										<ListItem
											button={!outcome.editing}
											component="li"
											key={"li" + index}
											className={classes.listItem}
										>
											<ListItemText
												key={"u2" + index + "listeItemTxt"}
												primary={
													outcomesTaxonomy[category].find(
														item => item.key === outcome.aux
													).label +
													" " +
													outcome.label
												}
												className={outcome.editing ? classes.hidden : ""}
											/>

											<Paper className={!outcome.editing ? classes.hidden : ""}>
												<TextField
													id="standard-select-currency"
													select
													SelectProps={{
														native: true
													}}
													// variant="outlined"
													value={controlEdit.tempAuxValue}
													onChange={event =>
														updateTempAuxValue(event.target.value)
													}
													className={classes.input}
												>
													{outcomesTaxonomy[category].map(option => (
														<option key={option.key} value={option.key}>
															{option.label}
														</option>
													))}
												</TextField>
												<TextField
													key={"u2" + index + "txtField"}
													value={controlEdit.tempValue}
													onChange={event =>
														updateTempValue(event.target.value)
													}
												/>
											</Paper>
											<ListItemSecondaryAction key={"u2" + index + "secAc"}>
												{outcome.editing ? (
													<React.Fragment>
														<IconButton
															key={"u2" + index + "btnEditSaveUnit"}
															edge="end"
															aria-label={"Save changes"}
															onClick={() =>
																handleEditedOutcome(index, category)
															}
															className={classes.saveButton}
															disabled={controlEdit.tempValue === ""}
														>
															<DoneIcon />
														</IconButton>
														<IconButton
															key={"u2" + index + "btnEditCancelUnit"}
															edge="end"
															aria-label={"Cancel changes"}
															onClick={() =>
																handleCancelEditOutcome(index, category)
															}
															className={classes.deleteButton}
														>
															<ClearIcon />
														</IconButton>
													</React.Fragment>
												) : (
													<React.Fragment>
														<IconButton
															key={"u2" + index + "btnEditUnit"}
															edge="end"
															aria-label={"Edit outcome name"}
															onClick={() => handleEditOutcome(index, category)}
															disabled={controlEdit.editing}
														>
															<EditIcon />
														</IconButton>
														<IconButton
															key={"u2" + index + "btnDeleteUnit"}
															edge="end"
															aria-label={"Delete outcome "}
															onClick={() =>
																handleDeleteOutcome(index, category)
															}
															className={classes.deleteButton}
														>
															<RemoveIcon />
														</IconButton>
													</React.Fragment>
												)}
											</ListItemSecondaryAction>
										</ListItem>
									))}
									<ListItem
										key="addrequisite"
										button
										onClick={() => handleNewOutcomes(category)}
										id="addrequisite"
										disabled={controlEdit.editing}
										className={classes.addButton}
									>
										<AddIcon /> <ListItemText primary="Add" />
									</ListItem>
								</List>
								<FeedbackHelp
									validation={{
										error: false,
										errorMsg: "",
										errorType: "",
										a11y: null
									}}
									tipMsg={category + " objectives are ...."}
									describedBy={"i05-helper-text"}
								/>
							</form>
						</Grid>
					</Grid>
				))}
          <Grid item>
            <FeedbackHelp
              validation={{
                error: analysisTooltip.outcomes,
                errorMsg: labels.errorMsgall,
                errorType: "",
                a11y: null
              }}
              tipMsg="By the end of this course, students will be able..."
              describedBy={"i05-helper-text"}
            />
          </Grid>
			</Grid>









     

    
      <Grid container className={classes.formGroup}>
        <Grid item xs={12} className="MuiFormLabel-root">
          <Typography variant="h6" className={classes.title}>{labels.learningconstraint}</Typography>
        </Grid>
        <Grid item xs={12}>
          <form>
            <List component="ul" key={"li0"} id="li0">
              {constraints.map((constraint, index) => (
                <ListItem
                  button={!constraint.editing}
                  component="li"
                  key={"li" + index}
                  className={classes.listItem}
                >
                  <ListItemText
                    key={"u2" + index + "listeItemTxt"}
                    primary={constraint.label}
                    className={constraint.editing ? classes.hidden : ""}
                  />
                  <div className={!constraint.editing ? classes.hidden : ""}>
                      <TextField
                        key={"u2" + index + "txtField"}
                        className={!constraint.editing ? classes.hidden : ""}
                        value={controlEdit.tempValue}
                        onChange={event => updateTempValue(event.target.value)}
                      />
                      <FeedbackHelp
                        validation={{
                          error: feedbackError,
                          errorMsg: message,
                          errorType: "required",
                          a11y: null
                        }}
                        tipMsg={labels.completeObjective}
                        describedBy={"i02-helper-text"}
                      />
                  </div>

                  <ListItemSecondaryAction key={"u2" + index + "secAc"}>
                    {constraint.editing ? (
                      <React.Fragment>
                        <IconButton
                          key={"u2" + index + "btnEditSaveUnit"}
                          edge="end"
                          aria-label={"Save changes"}
                          onClick={handleEditedRequisite(index)}
                          className={classes.saveButton}
                          disabled={controlEdit.tempValue === ""}
                        >
                          <DoneIcon />
                        </IconButton>
                        <IconButton
                          key={"u2" + index + "btnEditCancelUnit"}
                          edge="end"
                          aria-label={"Cancel changes"}
                          onClick={handleCancelEditRequisite(index)}
                          className={classes.deleteButton}
                        >
                          <ClearIcon />
                        </IconButton>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <IconButton
                          key={"u2" + index + "btnEditUnit"}
                          edge="end"
                          aria-label={"Edit unit name"}
                          onClick={handleEditRequisite(index)}
                          disabled={controlEdit.editing}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          key={"u2" + index + "btnDeleteUnit"}
                          edge="end"
                          // aria-label={"Delete constraint " + constraint.label}
                          onClick={handleDeleteRequisite(index)}
                          className={classes.deleteButton}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </React.Fragment>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              <ListItem
                key="addrequisite"
                button
                onClick={handleNewConstraint}
                id="addrequisite"
                disabled={controlEdit.editing}
                className={classes.addButton}
              >
                <AddIcon /> <ListItemText primary="Add constraint" />
              </ListItem>
            </List>
          </form>
          <FeedbackHelp
            validation={{
              error: false,
              errorMsg: "obligatorio",
              errorType: "",
              a11y: null
            }}
            tipMsg={labels.learningCon}
            describedBy={"learnConstraint-helper-text"}
          />
        </Grid>
      </Grid>
    
    
      <Grid container className={classes.formGroup}>
        <Grid item xs={12}  className="MuiFormLabel-root">
        <Typography variant="h6" className={classes.title}>{labels.modality}</Typography>
          <form className={classes.root}>
            <FormLabel component="legend">
              {labels.delivercontent}
            </FormLabel>
            <RadioGroup
              aria-label="Course delivery"
              name="coursePlan"
              value={modality}
               onChange={event => {
                 setmodality(event.target.value)
                 let analisis=analysisTooltip;
                 analisis.modality=false;
                 setanalysisTooltip(analisis)               
                 let modal=courseinformation;
                 modal.accessibility[2]=analysisTooltip;
                 modal.analysis[1]=event.target.value;
                 setcourseInformation(modal);
                 }}
            >
              <FormControlLabel
                value="online"
                control={<Radio />}
                label="Online"
              />
              <FormControlLabel
                value="hybrid"
                control={<Radio />}
                label="Hybrid"
              />
            </RadioGroup>
            <FeedbackHelp
              validation={{
                error: analysisTooltip.modality,
                errorMsg: labels.errorMsg,
                errorType: "",
                a11y: null
              }}
              tipMsg="Select beteween online course or blend online and face-to-face course."
              describedBy={"modality-helper-text"}
            />
          </form>
        </Grid>
      </Grid>

      <Grid container className={classes.formGroup}>
        <Grid item xs={12}  className="MuiFormLabel-root">
        <Typography variant="h6" className={classes.title }>Pedagogical considerations</Typography>
        <form className={classes.root}>
          <TextField
            value={pedagogical}
            required
            label={labels.pedagogicalconsiderations}
            variant="outlined"
            multiline
            rowsMax={5}
            id="i02"
            aria-describedby="i02-helper-text"
            type="text"
            error={analysisTooltip.pedagogical}
            fullWidth
            onChange={(event)=>{
              setpedagogical(event.target.value)
              
              if(event.target.value!=''){
                setanalysisTooltip((prevState)=>{
                  return{...prevState, pedagogical: false}
                })
              }else{
                 let analisis=analysisTooltip;
                 analisis.pedagogical=true;
                 setanalysisTooltip(analisis)
              }
              //save feedback
            
              let text=courseinformation;
              text.analysis[2]= event.target.value;
              text.accessibility[2]=analysisTooltip;
              setcourseInformation(text);

            }}
          />
          <FeedbackHelp
            validation={{
              error: analysisTooltip.pedagogical,
              errorMsg: labels.errorMsg,
              errorType: "",
              a11y: null
            }}
            tipMsg={labels.pedagogical}
            describedBy={"modality-helper-text"}
          />
        </form>
      </Grid>
      </Grid>
   
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
          <DialogTitle className="success-dialog-title" id="simple-dialog-title">Deleting audience</DialogTitle>
            <DialogContent className="success-dialog-content">
              <DialogContentText style={{padding: "0 1vw"}}>  You requested to delete {labelindexdelete}. Do you want to proceed?</DialogContentText>
              <WarningIcon className="warning-dialog-icon"/> 
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setopen(false)} color="primary">No</Button>
              <Button onClick={() => {
                console.log("tipo a borrar", typetodelete)
                if(typetodelete==='LearningObjectives'){
                  deleteLearning(indexdelete,categori)
                }else if(typetodelete==='outcomes'){
                  deleteOutcome(indexdelete,categori)
                }else{
                  deleteRequisite(indexdelete,'requisite')
                }       
                setopen(false)
              }} 
              color="primary"><em>Yes</em></Button> 
            </DialogActions>
      </Dialog>
    </div>
  );
}
