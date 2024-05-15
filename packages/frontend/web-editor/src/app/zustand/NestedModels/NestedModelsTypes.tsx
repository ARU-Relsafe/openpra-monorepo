import { NestedModelType } from "shared-types/src/lib/types/modelTypes/innerModels/nestedModel";
import { InitiatingEventsTypes } from "./TypesHelpers/InitiatingEventsTypes";

export type NestedModelsStateType = {
  parentId: string;
  // TODO:: Table of values
  OpStateAnalysis: string[];
  InitiatingEventsAnalysis: {
    InitiatingEvents: NestedModelType[];
    HeatBalanceFaultTrees: string[];
  };
  EventSequenceAnalysis: {
    EventSequenceAnalysisList: string[];
    EventSequenceDiagrams: string[];
    EventTrees: string[];
  };
  SuccessCriteriaDevelopment: {
    SuccessCriteria: string[];
    FunctionalEvents: string[];
  };
  SystemAnalysis: {
    SystemAnalysisList: string[];
    FaultTrees: string[];
    BayesianNetworks: string[];
    MarkovChains: string[];
  };
  HumanReliabilityAnalysis: {
    HumanReliabilityAnalysisList: string[];
  };
  DataAnalysis: {
    DataAnalysisList: string[];
    BayesianEstimation: string[];
    WeibullAnalysis: string[];
  };
  InternalFloodPRA: null;
  InternalFirePRA: null;
  SeismicPRA: null;
  HazardsScreeningPRA: null;
  HighWindsPRA: null;
  ExternalFloodingPRA: null;
  OtherHazardsPRA: null;
  EventSequenceQuantification: {
    EventSequenceQuantificationDiagram: string[];
  };
  MechanisticSourceTermAnalysis: {
    MechanisticSourceTerms: string[];
  };
  RadiologicalConsequenceAnalysis: {
    RadiologicalConsequenceAnalysisList: string[];
  };
  RiskIntegration: {
    RiskIntegrationList: string[];
  };
};

export type NestedModelsTypes = {
  NestedModels: NestedModelsStateType;
} & InitiatingEventsTypes;
