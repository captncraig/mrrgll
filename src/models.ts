
export interface CardDef {
    Name: string;
    URL: string;
    RegImage: string;
    GoldImage: string;
    Sounds: SoundDef[];
    Collectible: boolean;
}

export interface SoundDef{
    Name: string;
    URL: string;
}

export interface Card {
    Base: CardDef;
    Image: string;
    Sounds: string[];
    Weight: number;
}