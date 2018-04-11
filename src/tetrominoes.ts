import {Point2d, Tetromino} from './types';

// https://en.wikipedia.org/wiki/Tetris#Tetromino_colors
/**
 *             口
 * 口口口口 => 口
 *             口
 *             口
 **/
export const TETROMINO_I: Tetromino = {
  label: 'I',
  coords: [
    [[1, 0], [1, 1], [1, 2], [1, 3]],
    [[0, 1], [1, 1], [2, 1], [3, 1]],
  ]
};

/**
 * 口口口      口    口        口口
 *     口 =>   口 => 口口口 => 口
 *           口口              口
 **/
export const TETROMINO_J: Tetromino = {
  label: 'J',
  coords: [
    [[0, 0], [0, 1], [0, 2], [1, 2]],
    [[0, 1], [1, 1], [2, 0], [2, 1]],
    [[0, 0], [1, 0], [1, 1], [1, 2]],
    [[0, 0], [0, 1], [1, 0], [2, 0]]
  ]
};

/**
 * 口口口    口口        口    口
 * 口     =>   口 => 口口口 => 口
 *             口              口口
 **/
export const TETROMINO_L: Tetromino = {
  label: 'L',
  coords: [
    [[0, 0], [0, 1], [0, 2], [1, 0]],
    [[0, 0], [0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 0], [1, 1], [1, 2]],
    [[0, 0], [1, 0], [2, 0], [2, 1]]
  ]
};

/**
 * 口口
 * 口口
 **/
export const TETROMINO_O: Tetromino = {
  label: 'O',
  coords: [
    [[0, 0], [0, 1], [1, 0], [1, 1]]
  ]
};

/**
 *   口口    口
 * 口口   => 口口
 *             口
 **/
export const TETROMINO_S: Tetromino = {
  label: 'S',
  coords: [
    [[0, 0], [1, 0], [1, 1], [2, 1]],
    [[0, 1], [0, 2], [1, 0], [1, 1]]
  ]
};

/**
 * 口口口 =>   口 =>   口   => 口
 *   口      口口    口口口    口口
 *             口              口
 **/
export const TETROMINO_T: Tetromino = {
  label: 'T',
  coords: [
    [[0, 0], [0, 1], [0, 2], [1, 1]],
    [[0, 1], [1, 0], [1, 1], [2, 1]],
    [[0, 1], [1, 0], [1, 1], [1, 2]],
    [[0, 0], [1, 0], [1, 1], [2, 0]]
  ]
};

/**
 * 口口         口
 *   口口 =>  口口
 *            口
 **/
export const TETROMINO_Z: Tetromino = {
  label: 'Z',
  coords: [
    [[0, 0], [0, 1], [1, 1], [1, 2]],
    [[0, 1], [1, 0], [1, 1], [2, 0]]
  ]
};
