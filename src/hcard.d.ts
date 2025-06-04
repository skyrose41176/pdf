import { Plugin } from 'ckeditor5';

export class HCardEditing extends Plugin {
    static get requires(): Array<typeof Plugin>;
    init(): void;
    private _defineSchema(): void;
    private _defineConverters(): void;
    private _defineClipboardInputOutput(): void;
}

interface CardData {
    key: string;
}

declare function getCardDataFromViewElement(viewElement: any): CardData;
declare function getText(viewElement: any): string; 