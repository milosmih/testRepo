import { TestBed } from '@angular/core/testing';
import { IfEmptyMessagesPipe } from './if-empty-messages.pipe';
import { GroupedChatMessageDTO } from '../../infrastructure/models/grouped-chat-message.dto';

describe('IfEmptyMessagesPipe', () => {
    let pipe: IfEmptyMessagesPipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [IfEmptyMessagesPipe]
        });
        pipe = TestBed.inject(IfEmptyMessagesPipe);
    });

    it('should return true if the value is null or undefined', () => {
        expect(pipe.transform(null)).toBe(true);
        expect(pipe.transform(undefined)).toBe(true);
    });

    it('should return true if the value is an empty object', () => {
        expect(pipe.transform({})).toBe(true);
    });

    it('should return false if the value is not null, undefined, or an empty object', () => {
        const value = { conversationOne: [] } as GroupedChatMessageDTO;
        expect(pipe.transform(value)).toBe(false);
    });
});
