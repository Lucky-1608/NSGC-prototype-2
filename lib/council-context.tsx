'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Announcement {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    author: string;
    link?: string; // Optional external link
    category?: string;
    priority?: string;
}

export interface CouncilEvent {
    id: string;
    name: string;
    date: string;
    location: string;
    type?: string;
    registrationLink?: string;
    image?: string;
}

interface CouncilContextType {
    announcements: Announcement[];
    events: CouncilEvent[];
    addAnnouncement: (title: string, content: string, author: string, link?: string, category?: string, priority?: string) => void;
    deleteAnnouncement: (id: string) => void;
    addEvent: (name: string, date: string, location: string, type?: string, registrationLink?: string, image?: string) => void;
    deleteEvent: (id: string) => void;
}

const CouncilContext = createContext<CouncilContextType | undefined>(undefined);

export const useCouncil = () => {
    const context = useContext(CouncilContext);
    if (!context) {
        throw new Error('useCouncil must be used within a CouncilProvider');
    }
    return context;
};

const STORAGE_KEY = 'nsgc_council_data_v3';

export const CouncilProvider = ({ children }: { children: ReactNode }) => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [events, setEvents] = useState<CouncilEvent[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setAnnouncements(parsed.announcements || []);
                setEvents(parsed.events || []);
            } catch (e) {
                console.error('Failed to parse council data', e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to local storage whenever data changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ announcements, events }));
        }
    }, [announcements, events, isLoaded]);

    const addAnnouncement = (title: string, content: string, author: string, link?: string, category?: string, priority?: string) => {
        const newAnnouncement: Announcement = {
            id: uuidv4(),
            title,
            content,
            author,
            link,
            category: category || 'General',
            priority: priority || 'Low',
            createdAt: new Date().toISOString()
        };
        setAnnouncements(prev => [newAnnouncement, ...prev]);

        // Also add to global shared announcements so President and others can see them
        try {
            const savedShared = localStorage.getItem('nsgc_v3_announcements');
            const sharedAnnouncements = savedShared ? JSON.parse(savedShared) : [];
            const newSharedAnnouncement = {
                id: newAnnouncement.id,
                title,
                content,
                author,
                link,
                category: category || 'General',
                priority: priority || 'Low',
                date: new Date().toISOString().split('T')[0], // Shared data uses 'date' instead of 'createdAt'
                addedByRole: 'Council'
            };
            sharedAnnouncements.unshift(newSharedAnnouncement); // Add to beginning
            localStorage.setItem('nsgc_v3_announcements', JSON.stringify(sharedAnnouncements));
            window.dispatchEvent(new Event('nsgc-data-update'));
        } catch (e) {
            console.error('Failed to update shared announcements', e);
        }
    };

    const deleteAnnouncement = (id: string) => {
        setAnnouncements(prev => prev.filter(a => a.id !== id));
    };

    const addEvent = (name: string, date: string, location: string, type?: string, registrationLink?: string, image?: string) => {
        const newEvent: CouncilEvent = {
            id: uuidv4(),
            name,
            date,
            location,
            type: type || 'Social',
            registrationLink,
            image
        };
        setEvents(prev => [...prev, newEvent]);

        // Also add to global shared events so President can see them
        try {
            const savedShared = localStorage.getItem('nsgc_v3_events');
            const sharedEvents = savedShared ? JSON.parse(savedShared) : [];
            const newSharedEvent = {
                id: newEvent.id, // Keep the same ID
                name,
                date,
                location,
                type: type || 'Social',
                registrationLink,
                image,
                addedByRole: 'Council'
            };
            sharedEvents.push(newSharedEvent);
            localStorage.setItem('nsgc_v3_events', JSON.stringify(sharedEvents));
            window.dispatchEvent(new Event('nsgc-data-update'));
        } catch (e) {
            console.error('Failed to update shared events', e);
        }
    };

    const deleteEvent = (id: string) => {
        setEvents(prev => prev.filter(e => e.id !== id));
    };

    return (
        <CouncilContext.Provider value={{
            announcements,
            events,
            addAnnouncement,
            deleteAnnouncement,
            addEvent,
            deleteEvent
        }}>
            {children}
        </CouncilContext.Provider>
    );
};
