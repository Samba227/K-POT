import numpy as np


# this function return the euclidian distance between two matrix
def euclidian_distance(mat1, mat2):
    a = np.array(mat1)
    b = np.array(mat2)
    return round(np.linalg.norm(a - b), 4)


# this function return the index of the minimum distance between a matrix and a list of matrix and the score
def search_similar(mat1, list_of_mat):
    liste = []
    for i in range(len(list_of_mat)):
        liste.append(euclidian_distance(mat1, list_of_mat[i]))

    return liste.index(min(liste)), min(liste)

# this function determine if a connexion is suspisous or not
def is_suspicious(mat1, list_of_mat):
    liste = []
    for i in range(len(list_of_mat)):
        liste.append(euclidian_distance(mat1, list_of_mat[i]))

    m = min(liste)
    s = sum(liste)
    if 1/len(liste) > m/s:
        return m, True
    else:
        return m, False
