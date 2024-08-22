import Training from "./Training";

export default interface TrainingPlan {
    id: number;
    name: string;
    trenings: Training[];
}