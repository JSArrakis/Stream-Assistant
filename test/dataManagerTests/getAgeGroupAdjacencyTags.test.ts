import { AgeGroups } from "../../src/models/const/ageGroups";
import * as dataMan from "../../src/services/dataManager";

describe('getAgeGroupAdjacencyTags', () => {
    it('should return all adjacent tags (scenario 1)', () => {
        const ageGroups: string[] = []

        const expectedTags: string[] = [];
        
        const result: string[] = dataMan.getAgeGroupAdjacencyTags(ageGroups);

        expect(result).toEqual(expectedTags);
    });
    it('should return all adjacent tags (scenario 2)', () => {
        const ageGroups: string[] = [
            AgeGroups.Kids,
        ]

        const expectedTags: string[] = [
            AgeGroups.Kids,
            AgeGroups.Family,
        ];
        
        const result: string[] = dataMan.getAgeGroupAdjacencyTags(ageGroups);

        expect(result).toEqual(expectedTags);
    });
    it('should return all adjacent tags (scenario 3)', () => {
        const ageGroups: string[] = [
            AgeGroups.Family,
        ]

        const expectedTags: string[] = [
            AgeGroups.Family,
            AgeGroups.Kids,
            AgeGroups.YoungAdult,
        ];
        
        const result: string[] = dataMan.getAgeGroupAdjacencyTags(ageGroups);

        expect(result).toEqual(expectedTags);
    });
    it('should return all adjacent tags (scenario 4)', () => {
        const ageGroups: string[] = [
            AgeGroups.YoungAdult,
        ]

        const expectedTags: string[] = [
            AgeGroups.YoungAdult,
            AgeGroups.Family,
            AgeGroups.Mature,
        ];
        
        const result: string[] = dataMan.getAgeGroupAdjacencyTags(ageGroups);

        expect(result).toEqual(expectedTags);
    });
    it('should return all adjacent tags (scenario 5)', () => {
        const ageGroups: string[] = [
            AgeGroups.Mature,
        ]

        const expectedTags: string[] = [
            AgeGroups.Mature,
            AgeGroups.YoungAdult,
        ];
        
        const result: string[] = dataMan.getAgeGroupAdjacencyTags(ageGroups);

        expect(result).toEqual(expectedTags);
    });
    it('should return all adjacent tags (scenario 6)', () => {
        const ageGroups: string[] = [
            AgeGroups.Kids,
            AgeGroups.Family,
        ]

        const expectedTags: string[] = [
            AgeGroups.Kids,
            AgeGroups.Family,
        ];
        
        const result: string[] = dataMan.getAgeGroupAdjacencyTags(ageGroups);

        expect(result).toEqual(expectedTags);
    });
    it('should return all adjacent tags (scenario 7)', () => {
        const ageGroups: string[] = [
            AgeGroups.Family,
            AgeGroups.Kids,
        ]

        const expectedTags: string[] = [
            AgeGroups.Family,
            AgeGroups.Kids,
        ];
        
        const result: string[] = dataMan.getAgeGroupAdjacencyTags(ageGroups);

        expect(result).toEqual(expectedTags);
    });
    it('should return all adjacent tags (scenario 8)', () => {
        const ageGroups: string[] = [
            AgeGroups.Family,
            AgeGroups.YoungAdult,
        ]

        const expectedTags: string[] = [
            AgeGroups.Family,
            AgeGroups.Kids,
            AgeGroups.YoungAdult,
        ];
        
        const result: string[] = dataMan.getAgeGroupAdjacencyTags(ageGroups);

        expect(result).toEqual(expectedTags);
    });
    it('should return all adjacent tags (scenario 9)', () => {
        const ageGroups: string[] = [
            AgeGroups.YoungAdult,
            AgeGroups.Family,

        ]

        const expectedTags: string[] = [
            AgeGroups.YoungAdult,
            AgeGroups.Family,
            AgeGroups.Kids,

        ];
        
        const result: string[] = dataMan.getAgeGroupAdjacencyTags(ageGroups);

        expect(result).toEqual(expectedTags);
    });
    it('should return all adjacent tags (scenario 10)', () => {
        const ageGroups: string[] = [
            AgeGroups.YoungAdult,
            AgeGroups.Mature,
        ]

        const expectedTags: string[] = [
            AgeGroups.YoungAdult,
            AgeGroups.Family,
            AgeGroups.Mature,
        ];
        
        const result: string[] = dataMan.getAgeGroupAdjacencyTags(ageGroups);

        expect(result).toEqual(expectedTags);
    });
    it('should return all adjacent tags (scenario 11)', () => {
        const ageGroups: string[] = [
            AgeGroups.Mature,
            AgeGroups.YoungAdult,
        ]

        const expectedTags: string[] = [
            AgeGroups.Mature,
            AgeGroups.YoungAdult,
            AgeGroups.Family,
        ];
        
        const result: string[] = dataMan.getAgeGroupAdjacencyTags(ageGroups);

        expect(result).toEqual(expectedTags);
    });
});