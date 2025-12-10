'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type TicketStatus = 'Pending' | 'In Review' | 'In Progress' | 'Completed';
export type TicketPriority = 'Low' | 'Medium' | 'High';
export type Department = 'Academic' | 'Hostel' | 'Sanitation' | 'Ragging' | 'Other';

export interface TimelineEvent {
    status: string;
    date: string;
    completed: boolean;
    description?: string;
}

export interface Ticket {
    id: string;
    studentName: string;
    email: string;
    department: string; // Using string to allow flexibility, but typed as Department in UI
    type: string;
    description: string;
    priority: TicketPriority;
    status: TicketStatus;
    assignedTo: string | null;
    createdAt: string;
    updatedAt: string;
    timeline: TimelineEvent[];
    proofUrl?: string; // Mock URL
}

interface TicketContextType {
    tickets: Ticket[];
    createTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'timeline' | 'status' | 'assignedTo'>) => void;
    updateTicketStatus: (id: string, status: TicketStatus, note?: string) => void;
    assignTicket: (id: string, adminName: string) => void;
    addComment: (id: string, comment: string) => void;
    getTicketById: (id: string) => Ticket | undefined;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const useTickets = () => {
    const context = useContext(TicketContext);
    if (!context) {
        throw new Error('useTickets must be used within a TicketProvider');
    }
    return context;
};

const STORAGE_KEY = 'nsgc_tickets_v1';

export const TicketProvider = ({ children }: { children: ReactNode }) => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setTickets(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse tickets', e);
            }
        } else {
            // Add some dummy data for demo purposes
            const dummyTickets: Ticket[] = [
                {
                    id: 'CMP-2025-001',
                    studentName: 'Alice Johnson',
                    email: 'alice@example.com',
                    department: 'Hostel',
                    type: 'Water Supply',
                    description: 'No water in Block A 2nd floor since yesterday.',
                    priority: 'High',
                    status: 'In Progress',
                    assignedTo: 'Warden Smith',
                    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
                    updatedAt: new Date(Date.now() - 3600000).toISOString(),
                    timeline: [
                        { status: 'Received', date: new Date(Date.now() - 86400000 * 2).toLocaleString(), completed: true, description: 'Ticket created' },
                        { status: 'In Review', date: new Date(Date.now() - 86400000).toLocaleString(), completed: true, description: 'Reviewed by admin' },
                        { status: 'In Progress', date: new Date(Date.now() - 3600000).toLocaleString(), completed: true, description: 'Maintenance team dispatched' },
                    ]
                },
                {
                    id: 'CMP-2025-002',
                    studentName: 'Bob Williams',
                    email: 'bob@example.com',
                    department: 'Academic',
                    type: 'Grade Correction',
                    description: 'My Math 101 grade is incorrect on the portal.',
                    priority: 'Medium',
                    status: 'Pending',
                    assignedTo: null,
                    createdAt: new Date(Date.now() - 43200000).toISOString(),
                    updatedAt: new Date(Date.now() - 43200000).toISOString(),
                    timeline: [
                        { status: 'Received', date: new Date(Date.now() - 43200000).toLocaleString(), completed: true, description: 'Ticket created' },
                    ]
                }
            ];
            setTickets(dummyTickets);
        }
        setIsLoaded(true);
    }, []);

    // Save to local storage whenever tickets change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
        }
    }, [tickets, isLoaded]);

    const createTicket = (data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'timeline' | 'status' | 'assignedTo'>) => {
        const newTicket: Ticket = {
            ...data,
            id: `CMP-2025-${String(tickets.length + 100).padStart(3, '0')}`,
            status: 'Pending',
            assignedTo: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            timeline: [
                {
                    status: 'Received',
                    date: new Date().toLocaleString(),
                    completed: true,
                    description: 'Ticket created successfully'
                }
            ]
        };
        setTickets(prev => [newTicket, ...prev]);
    };

    const updateTicketStatus = (id: string, status: TicketStatus, note?: string) => {
        setTickets(prev => prev.map(ticket => {
            if (ticket.id === id) {
                const newTimelineItem: TimelineEvent = {
                    status: status,
                    date: new Date().toLocaleString(),
                    completed: true,
                    description: note || `Status updated to ${status}`
                };
                return {
                    ...ticket,
                    status,
                    updatedAt: new Date().toISOString(),
                    timeline: [...ticket.timeline, newTimelineItem]
                };
            }
            return ticket;
        }));
    };

    const assignTicket = (id: string, adminName: string) => {
        setTickets(prev => prev.map(ticket => {
            if (ticket.id === id) {
                return {
                    ...ticket,
                    assignedTo: adminName,
                    status: ticket.status === 'Pending' ? 'In Review' : ticket.status,
                    updatedAt: new Date().toISOString(),
                    timeline: [...ticket.timeline, {
                        status: 'Assigned',
                        date: new Date().toLocaleString(),
                        completed: true,
                        description: `Assigned to ${adminName}`
                    }]
                };
            }
            return ticket;
        }));
    };

    const addComment = (id: string, comment: string) => {
        // In a real app, comments might be a separate array. Here we'll just log it in the timeline/update time
        setTickets(prev => prev.map(ticket => {
            if (ticket.id === id) {
                return {
                    ...ticket,
                    updatedAt: new Date().toISOString(),
                    timeline: [...ticket.timeline, {
                        status: 'Comment Added',
                        date: new Date().toLocaleString(),
                        completed: true,
                        description: comment
                    }]
                };
            }
            return ticket;
        }));
    };

    const getTicketById = (id: string) => tickets.find(t => t.id === id);

    return (
        <TicketContext.Provider value={{ tickets, createTicket, updateTicketStatus, assignTicket, addComment, getTicketById }}>
            {children}
        </TicketContext.Provider>
    );
};
